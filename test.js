import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

const cloudinaryConfig = {
  cloud_name: 'dt2eofiqv',
  api_key: '151234388748947',
  api_secret: 'sSw2Swu6SD0tzYppvP9VurKm_so'
}

cloudinary.config(cloudinaryConfig)

// Create a small test PNG image (1x1 pixel)
const testImageBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02,
  0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44,
  0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0x0f, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00,
  0x1b, 0xb6, 0xee, 0x56, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
  0x42, 0x60, 0x82
])

console.log('Testing Cloudinary credentials...')
console.log('Cloud Name:', cloudinaryConfig.cloud_name)
console.log('API Key:', cloudinaryConfig.api_key)
console.log('')

// Test 1: Check credentials
console.log('🔍 Test 1: Checking credentials...')
try {
  const testResult = await cloudinary.api.resources({ max_results: 1 })
  console.log('✅ Credentials are valid!')
} catch (error) {
  console.log('❌ Invalid credentials:', error.message)
}

// Test 2: Upload test image with longer timeout
console.log('\n🔍 Test 2: Uploading test image...')
const uploadPromise = new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'test',
      resource_type: 'image',
      public_id: `test_upload_${Date.now()}`,
      timeout: 60000 // 60 seconds timeout
    },
    (error, result) => {
      if (error) {
        console.error('❌ Upload failed:')
        console.error('Error message:', error.message)
        console.error('HTTP code:', error.http_code)
        console.error('Full error:', error)
        reject(error)
      } else {
        console.log('✅ Upload successful!')
        console.log('Public ID:', result.public_id)
        console.log('URL:', result.secure_url)
        resolve(result)
      }
    }
  )

  // Set timeout for the stream
  const timeout = setTimeout(() => {
    uploadStream.destroy(new Error('Upload timeout after 60 seconds'))
  }, 60000)

  streamifier.createReadStream(testImageBuffer).pipe(uploadStream)
})

try {
  await uploadPromise
} catch (error) {
  console.error('❌ Upload promise failed:', error.message)
}

// Test 3: Test network connectivity
console.log('\n🔍 Test 3: Testing network connectivity...')
try {
  const https = await import('https')
  const url = 'https://api.cloudinary.com/v1_1/dt2eofiqv/resources/image'

  const response = await new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${cloudinaryConfig.api_key}:${cloudinaryConfig.api_secret}`).toString('base64')}`
      },
      timeout: 10000
    }, (res) => {
      resolve(res.statusCode)
    })

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Network timeout'))
    })
  })

  console.log('✅ Network connectivity OK, status:', response)
} catch (error) {
  console.log('❌ Network connectivity failed:', error.message)
}

console.log('\n🎯 Test completed!')
