import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Plus, 
  X, 
  Star,
  Eye,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Gem,
  Camera,
  ImageIcon
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useWallet } from '../context/WalletContext';
import { algodClient, decodeTransactionFromBase64 } from '../utils/wallet';
import * as algosdk from 'algosdk';

const UploadAnime: React.FC = () => {
  const { user, showToast } = useUser();
  const { walletAddress, connect, signTxnWithPera } = useWallet();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episodes: 1,
    thumbnail: '',
    thumbnailFile: null as File | null,
    status: 'draft' as 'draft' | 'published'
  });
  const [isSigning, setIsSigning] = useState(false);
  
async function waitForAppConfirmation(txId: string, timeout = 60): Promise<number> {
  // 1) Fetch node status and normalize the round number
  const status = await algodClient.status().do();
  console.log("🕵️‍♂️ Node status:", status);
  const rawLastRound = status["last-round"] ?? status.lastRound;
  let currentRound = typeof rawLastRound === "bigint"
    ? Number(rawLastRound)
    : Number(rawLastRound);

  if (isNaN(currentRound)) {
    throw new Error("Invalid currentRound (NaN) — check your algodClient.status() keys");
  }
  console.log(`⏳ Starting at round ${currentRound}`);

  // 2) Poll for confirmation
  for (let i = 0; i < timeout; i++) {
    let pending: any;
    try {
      pending = await algodClient.pendingTransactionInformation(txId).do();
    } catch (e) {
      console.warn("⚠️ pendingTransactionInformation failed:", e);
      pending = {};
    }
    console.log(`🔍 Pending info (round ${currentRound}):`, pending);

    const confirmedRound = pending["confirmed-round"] ?? pending["confirmedRound"];
    if (confirmedRound && confirmedRound > 0) {
      console.log(`✅ TX ${txId} confirmed in round ${confirmedRound}`);
      return pending["application-index"] ?? pending["applicationIndex"] ?? confirmedRound;
    }

    // 3) Wait for the next block
    const nextRound = currentRound + 1;
    try {
      await algodClient.statusAfterBlock(nextRound).do();
    } catch (e) {
      console.warn(`⚠️ statusAfterBlock(${nextRound}) failed:`, e);
    }
    currentRound = nextRound;
  }

  throw new Error(`Transaction ${txId} not confirmed after ${timeout} rounds`);
}


  const [nftCollection, setNftCollection] = useState([
    {
      id: 1,
      name: '',
      description: '',
      rarity: 'Common' as 'Common' | 'Rare' | 'Epic' | 'Legendary',
      image: '',
      imageFile: null as File | null,
      episode: 1,
      watchTimeRequired: 15
    }
  ]);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Move fileToBase64 function inside component scope
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // returns data:image/...;base64,...
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper function to format error messages for better user experience
  const formatErrorMessage = (error: string | undefined): string => {
    if (!error) {
      return 'An unexpected error occurred. Please try again.';
    }
    
    // Check if error is a short, cryptic string (likely not user-friendly)
    if (error.length <= 3 || /^[a-z]{1,3}$/i.test(error.trim())) {
      return 'An unexpected server error occurred. Please try again or contact support.';
    }
    
    // Return the original error if it seems descriptive enough
    return error;
  };

  const rarityColors = {
    Common: 'from-gray-500 to-gray-400',
    Rare: 'from-blue-500 to-purple-500',
    Epic: 'from-purple-500 to-pink-500',
    Legendary: 'from-yellow-500 to-orange-500'
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNftChange = (index: number, field: string, value: string | number) => {
    setNftCollection(prev => prev.map((nft, i) => 
      i === index ? { ...nft, [field]: value } : nft
    ));
  };

  const handleImageUpload = (index: number, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setNftCollection(prev => prev.map((nft, i) => 
          i === index ? { 
            ...nft, 
            image: imageUrl,
            imageFile: file
          } : nft
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData(prev => ({ 
          ...prev, 
          thumbnail: imageUrl,
          thumbnailFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addNftToCollection = () => {
    setNftCollection(prev => [...prev, {
      id: prev.length + 1,
      name: '',
      description: '',
      rarity: 'Common',
      image: '',
      imageFile: null,
      episode: 1,
      watchTimeRequired: 15
    }]);
  };

  const removeNftFromCollection = (index: number) => {
    if (nftCollection.length > 1) {
      setNftCollection(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    // Prevent multiple simultaneous submissions
    if (isSigning || uploadStatus === 'uploading') {
      console.warn('⏳ Upload already in progress — skipping.');
      showToast('Upload already in progress. Please wait...', 'info');
      return;
    }

    // Add explicit client-side validation
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();

    console.log('🚀 Starting upload process...', { status, title: trimmedTitle });
    showToast('Starting upload process...', 'info');

    if (!trimmedTitle) {
      console.error('❌ Validation failed: Missing title');
      showToast('Please enter a title for your anime', 'error');
      return;
    }

    if (!trimmedDescription) {
      console.error('❌ Validation failed: Missing description');
      showToast('Please enter a description for your anime', 'error');
      return;
    }

    // Connect wallet if not connected
    if (!walletAddress) {
      console.log('🔌 Wallet not connected, attempting to connect...');
      showToast('Connecting wallet...', 'info');
      try {
        await connect();
        console.log('✅ Wallet connected successfully');
        showToast('Wallet connected successfully', 'success');
      } catch (error) {
        console.error('❌ Wallet connection failed:', error);
        showToast('Failed to connect wallet. Please try again.', 'error');
        return;
      }
    }

    // Check wallet address after connection attempt
    if (!walletAddress) {
      console.error('❌ Validation failed: Missing wallet address');
      showToast('Wallet address not found. Please reconnect your wallet.', 'error');
      return;
    }

    // Validate NFT collection has at least one valid NFT
    const validNfts = nftCollection.filter(nft => nft.name.trim() && nft.image);
    if (validNfts.length === 0) {
      console.error('❌ Validation failed: No valid NFTs');
      showToast('Please add at least one NFT with a name and image', 'error');
      return;
    }

    console.log('✅ Validation passed. Processing files...', { validNfts: validNfts.length });
    setUploadStatus('uploading');
    showToast('Processing files and uploading to IPFS...', 'info');

    try {
      // Convert thumbnail image file to base64 if available
      let thumbnailBase64 = formData.thumbnail;
      if (formData.thumbnailFile) {
        console.log('📸 Converting thumbnail to base64...');
        thumbnailBase64 = await fileToBase64(formData.thumbnailFile);
        showToast('Thumbnail processed successfully', 'success');
      }

      // Convert all NFT image files to base64
      console.log('🎨 Converting NFT images to base64...');
      const nftCollectionWithImages = await Promise.all(
        nftCollection.map(async (nft, index) => {
          let imageBase64 = nft.image;
          if (nft.imageFile) {
            console.log(`📷 Processing NFT image ${index + 1}...`);
            imageBase64 = await fileToBase64(nft.imageFile);
          }

          return {
            id: `nft_${Date.now()}_${nft.id}`,
            name: nft.name.trim() || `NFT #${nft.id}`,
            image: imageBase64 || '', // base64 string
            anime: trimmedTitle,
            episode: nft.episode,
            watchTime: nft.watchTimeRequired,
            rarity: nft.rarity,
            isListed: false,
            mintedAt: new Date()
          };
        })
      );

      console.log('✅ All images processed successfully');
      showToast('All images processed successfully', 'success');

      // Construct the anime metadata object with wallet address as creator
      const animeData = {
        id: `anime_${Date.now()}`,
        title: trimmedTitle,
        description: trimmedDescription,
        episodes: formData.episodes,
        thumbnail: thumbnailBase64 || '',
        status,
        nftCollection: nftCollectionWithImages,
        creatorId: user.id,
        createdAt: new Date(),
        views: 0,
        likes: 0,
        genres: ['Action', 'Adventure'] // Default genres
      };

      // Enhanced metadata with wallet address as creator
      const metadata = {
        wallet: walletAddress, // This is the creator's wallet address
        metadata: animeData,
        creator: {
            id: user.id,
            username: user.username,
            walletAddress: walletAddress, // Store wallet address as creator
        },
        platform: 'OtakuVerse',
        version: '1.0',
        timestamp: new Date().toISOString()
      };

      console.log('📤 Sending metadata to backend with creator wallet address...', { 
        wallet: walletAddress,
        creatorWallet: walletAddress,
        title: trimmedTitle,
        nftCount: nftCollectionWithImages.length
      });
      showToast('Uploading to blockchain...', 'info');

      // Send metadata to backend
      const response = await fetch('https://otakuverse-alogrand.onrender.com/publish-nft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metadata)
      });

      console.log('📡 Backend response received:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok
      });

      // Check if response contains JSON data
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ Invalid response format:', contentType);
        throw new Error('Server response is not JSON format');
      }

      // Parse the response
      const result = await response.json();
      console.log('📋 Parsed backend result:', result);

      // Check if backend returned an error
      if (!response.ok) {
        console.error("🔥 Backend Error Response:", result);
        const formattedError = formatErrorMessage(result?.error);
        showToast(`Upload failed: ${formattedError}`, 'error');
        throw new Error(`HTTP ${response.status}: ${formattedError}`);
      }

      // Validate success flag in result
      if (!result.success) {
        console.error('❌ Backend reported failure:', result.error);
        const formattedError = formatErrorMessage(result.error);
        showToast(`Upload failed: ${formattedError}`, 'error');
        throw new Error(formattedError);
      }

      // Handle transaction signing if transaction is provided
      if (result.txn) {
        if (isSigning) {
          console.warn('⏳ Signing already in progress — skipping.');
          showToast('Transaction signing already in progress. Please wait...', 'info');
          return;
        }

        setIsSigning(true);
        try {
          console.log('🔐 Processing transaction for signing...');
          showToast('Please check your Pera Wallet to sign the transaction...', 'info');

          if (!result.txn || typeof result.txn !== 'string') {
            throw new Error('Invalid transaction data received from backend');
          }

          const transaction = decodeTransactionFromBase64(result.txn);
          console.log('✅ Transaction decoded successfully');

          // ✍️ Sign with Pera Wallet
          console.log('✍️ Signing transaction with Pera Wallet...');
          const signedTxn = await signTxnWithPera(transaction);
          console.log('✅ Transaction signed successfully');

          // 📡 Broadcast
          const res = await algodClient.sendRawTransaction(signedTxn).do();
          console.log('🎉 Transaction broadcasted successfully!', res);
          
          const txId = res.txId || res.txID || res.txid; // depending on what Algod returns
          const appId = await waitForAppConfirmation(txId, 30);
          const appIdToStore = typeof appId === 'bigint' ? Number(appId) : appId;
          console.log("🎯 Deployed Contract App ID:", appIdToStore);
          await fetch('https://372c-49-43-154-254.ngrok-free.app/store-app-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallet: walletAddress,
              app_id: appIdToStore  // returned from waitForAppConfirmation()
              })
            });

          showToast(`Transaction successful! TxID: ${txId}`, 'success');

        } catch (txnError: any) {
          console.error('❌ Transaction processing failed:', txnError);
          
          // Handle specific Pera Wallet error codes
          if (txnError?.message?.includes('4100') || txnError?.message?.includes('Transaction request pending')) {
            showToast('⚠️ Pera Wallet has a pending transaction. Please open your Pera Wallet app and approve or reject the existing transaction request, then try again.', 'error');
          } else if (txnError?.message?.includes('4001') || txnError?.message?.includes('User rejected')) {
            showToast('Transaction was cancelled by user.', 'info');
          } else {
            const errorMessage = txnError instanceof Error ? txnError.message : 'Unknown transaction error';
            showToast(`Transaction failed: ${errorMessage}`, 'error');
          }
          
          // Don't throw here - let the upload continue without blockchain transaction
          console.log('⚠️ Continuing without blockchain transaction due to wallet error');
        } finally {
          setIsSigning(false);
        }
      }

      console.log('🎉 Upload successful!', { ipfs_cid: result.ipfs_cid });
      showToast(`📦 Successfully uploaded to IPFS: ${result.ipfs_cid}`, 'success');
      setUploadStatus('success');

      // Send anime data to backend database with creator wallet address
      console.log('💾 Sending anime data to backend database with creator wallet address...');
      showToast('Saving anime to database...', 'info');
      
      try {
        const finalAnimeMetadata = result.updated_metadata;

        // Enhanced anime submission payload with creator wallet address
        const animeSubmissionPayload = {
          anime: finalAnimeMetadata,
          ipfs_cid: result.ipfs_cid,
          creator: {
            id: user.id,
            username: user.username,
            walletAddress: walletAddress // Ensure wallet address is included as creator
          },
          creatorWallet: walletAddress, // Additional field for creator wallet
          timestamp: new Date().toISOString()
        };

        console.log('📤 Anime submission payload:', {
          animeTitle: finalAnimeMetadata?.title,
          creatorWallet: walletAddress,
          creatorUsername: user.username,
          ipfsCid: result.ipfs_cid
        });

        const animeResponse = await fetch('https://372c-49-43-154-254.ngrok-free.app/submit-anime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(animeSubmissionPayload)
        });

        if (!animeResponse.ok) {
          const errorData = await animeResponse.json().catch(() => ({ error: 'Unknown database error' }));
          console.error('❌ Failed to save anime to database:', errorData);
          showToast(`Warning: Anime uploaded but database save failed: ${errorData.error || 'Unknown error'}`, 'error');
        } else {
          const animeResult = await animeResponse.json();
          console.log('✅ Anime saved to database successfully with creator wallet:', {
            result: animeResult,
            creatorWallet: walletAddress
          });
          showToast('Anime saved to database successfully!', 'success');
        }
      } catch (dbError) {
        console.error('❌ Database save error:', dbError);
        showToast('Warning: Anime uploaded but database save failed. Please contact support.', 'error');
      }

      // Show success toast
      showToast('Anime Successfully Published! 🎉', 'success');

      // Reset form after delay
      setTimeout(() => {
        console.log('🔄 Resetting form...');
        setFormData({
          title: '',
          description: '',
          episodes: 1,
          thumbnail: '',
          thumbnailFile: null,
          status: 'draft'
        });

        setNftCollection([{
          id: 1,
          name: '',
          description: '',
          rarity: 'Common',
          image: '',
          imageFile: null,
          episode: 1,
          watchTimeRequired: 15
        }]);

        setUploadStatus('idle');
        showToast('Form reset. Ready for next upload!', 'info');
      }, 3000);

    } catch (error) {
      console.error('💥 Upload process failed:', error);
      setUploadStatus('error');
      
      // Show detailed error message with improved formatting
      const errorMessage = error instanceof Error ? formatErrorMessage(error.message) : 'An unexpected error occurred. Please try again.';
      showToast(`Upload failed: ${errorMessage}`, 'error');
      
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  if (!user.userType || user.userType !== 'creator') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-card p-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Only creators can access the upload feature.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2"
        >
          Upload Anime Content
        </motion.h1>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Create and publish your anime content with custom NFT rewards
        </motion.p>
      </div>

      {/* Upload Status */}
      {uploadStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-4 mb-6 border ${
            uploadStatus === 'success' ? 'border-green-400/30 bg-green-500/10' :
            uploadStatus === 'error' ? 'border-red-400/30 bg-red-500/10' :
            'border-blue-400/30 bg-blue-500/10'
          }`}
        >
          <div className="flex items-center space-x-3">
            {uploadStatus === 'uploading' && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <span className="text-blue-400">Uploading content...</span>
              </>
            )}
            {uploadStatus === 'success' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400">Content uploaded successfully!</span>
              </>
            )}
            {uploadStatus === 'error' && (
              <>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Upload failed. Please try again.</span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Wallet Status Warning */}
      {isSigning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 border border-yellow-400/30 bg-yellow-500/10"
        >
          <div className="flex items-center space-x-3">
            <div className="animate-pulse rounded-full h-5 w-5 bg-yellow-400"></div>
            <span className="text-yellow-400">
              Please check your Pera Wallet app to sign the transaction. If you have a pending transaction, please approve or reject it first.
            </span>
          </div>
        </motion.div>
      )}

      {/* Creator Wallet Info */}
      {walletAddress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 border border-green-400/30 bg-green-500/10"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <span className="text-green-400 font-semibold">Creator Wallet Connected: </span>
              <span className="text-white font-mono text-sm">{walletAddress}</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            This wallet address will be stored as the creator for all uploaded content and NFTs.
          </p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-orbitron font-semibold text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-anime-purple" />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Anime Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter anime title..."
                  className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-anime-purple/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your anime..."
                  rows={4}
                  className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-anime-purple/50"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Episodes
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.episodes}
                    onChange={(e) => handleInputChange('episodes', parseInt(e.target.value))}
                    className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-anime-purple/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleThumbnailUpload(file);
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3 text-gray-400 cursor-pointer hover:border-anime-purple/50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{formData.thumbnail ? 'Change Image' : 'Upload Thumbnail'}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* NFT Collection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-orbitron font-semibold text-white flex items-center">
                <Gem className="w-5 h-5 mr-2 text-anime-pink" />
                NFT Collection
              </h2>
              <button
                onClick={addNftToCollection}
                className="flex items-center space-x-2 px-4 py-2 bg-anime-purple/20 hover:bg-anime-purple/30 border border-anime-purple/30 rounded-lg text-anime-purple transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add NFT</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {nftCollection.map((nft, index) => (
                <div key={nft.id} className="bg-black/30 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">NFT #{index + 1}</h3>
                    {nftCollection.length > 1 && (
                      <button
                        onClick={() => removeNftFromCollection(index)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* NFT Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      NFT Image *
                    </label>
                    <div className="flex items-center space-x-4">
                      {/* Image Preview */}
                      <div className="w-20 h-20 bg-black/50 border border-purple-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                        {nft.image ? (
                          <img
                            src={nft.image}
                            alt="NFT Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        )}
                      </div>
                      
                      {/* Upload Button */}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                          className="hidden"
                          id={`nft-image-${index}`}
                        />
                        <label
                          htmlFor={`nft-image-${index}`}
                          className="w-full bg-black/50 border border-purple-500/20 rounded px-3 py-2 text-gray-400 cursor-pointer hover:border-anime-purple/50 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">
                            {nft.image ? 'Change Image' : 'Upload Image'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        NFT Name
                      </label>
                      <input
                        type="text"
                        value={nft.name}
                        onChange={(e) => handleNftChange(index, 'name', e.target.value)}
                        placeholder="NFT name..."
                        className="w-full bg-black/50 border border-purple-500/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-anime-purple/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Rarity
                      </label>
                      <select
                        value={nft.rarity}
                        onChange={(e) => handleNftChange(index, 'rarity', e.target.value)}
                        className="w-full bg-black/50 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
                      >
                        <option value="Common">Common</option>
                        <option value="Rare">Rare</option>
                        <option value="Epic">Epic</option>
                        <option value="Legendary">Legendary</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Episode
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={formData.episodes}
                        value={nft.episode}
                        onChange={(e) => handleNftChange(index, 'episode', parseInt(e.target.value))}
                        className="w-full bg-black/50 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Watch Time Required (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={nft.watchTimeRequired}
                        onChange={(e) => handleNftChange(index, 'watchTimeRequired', parseInt(e.target.value))}
                        className="w-full bg-black/50 border border-purple-500/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      NFT Description
                    </label>
                    <textarea
                      value={nft.description}
                      onChange={(e) => handleNftChange(index, 'description', e.target.value)}
                      placeholder="Describe this NFT..."
                      rows={2}
                      className="w-full bg-black/50 border border-purple-500/20 rounded px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-anime-purple/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-orbitron font-semibold text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-anime-cyan" />
              Preview
            </h3>
            
            {formData.title ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={formData.thumbnail || 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg'}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-3">
                    <div>
                      <h4 className="text-white font-semibold text-sm">{formData.title}</h4>
                      <p className="text-gray-300 text-xs">{formData.episodes} Episodes</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm line-clamp-3">
                  {formData.description || 'No description provided...'}
                </p>
                
                <div className="text-xs text-gray-500">
                  NFTs: {nftCollection.length} collectibles
                </div>
                
                {/* Creator Info */}
                {walletAddress && (
                  <div className="text-xs text-gray-500 border-t border-purple-500/20 pt-3">
                    <p className="font-semibold text-gray-400">Creator:</p>
                    <p className="font-mono">{walletAddress}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-500 text-sm">Fill in the details to see preview</p>
              </div>
            )}
          </motion.div>

          {/* NFT Collection Preview */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-orbitron font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-anime-yellow" />
              NFT Collection
            </h3>
            
            <div className="space-y-3">
              {nftCollection.map((nft, index) => (
                <div key={nft.id} className="bg-black/30 rounded-lg p-3 border border-purple-500/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-black/50 rounded border border-purple-500/20 overflow-hidden flex items-center justify-center">
                      {nft.image ? (
                        <img
                          src={nft.image}
                          alt="NFT"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">
                          {nft.name || `NFT #${index + 1}`}
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white`}>
                          {nft.rarity}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Episode {nft.episode} • {nft.watchTimeRequired}min watch time
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-orbitron font-semibold text-white mb-4">
              Publish Options
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={!formData.title.trim() || !formData.description.trim() || uploadStatus === 'uploading' || isSigning}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save as Draft</span>
              </button>
              
              <button
                onClick={() => handleSubmit('published')}
                disabled={!formData.title.trim() || !formData.description.trim() || uploadStatus === 'uploading' || isSigning}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 anime-gradient rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{isSigning ? 'Signing Transaction...' : 'Publish Now'}</span>
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              * Published content will be available to all users immediately
              {isSigning && (
                <div className="mt-2 text-yellow-400">
                  ⚠️ Please check your Pera Wallet to complete the transaction
                </div>
              )}
              {walletAddress && (
                <div className="mt-2 text-green-400">
                  ✅ Creator wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadAnime;