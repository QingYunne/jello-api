import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import axios from 'axios'

// Create a small test image
const testImageBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02,
  0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44,
  0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0x0f, 0x00, 0x00, 0x01, 0x01, 0x01, 0x00,
  0x1b, 0xb6, 0xee, 0x56, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
  0x42, 0x60, 0x82
])

// Save test image to file
fs.writeFileSync('test-avatar.png', testImageBuffer)

console.log('Testing avatar upload via API...')

// Test upload via API
async function testAvatarUpload() {
  try {
    // First login to get token
    console.log('🔍 Step 1: Login...')
    const loginResponse = await axios.post('http://localhost:8017/v1/users/login', {
      email: 'test@example.com', // Replace with your test user
      password: 'password123'
    })

    const accessToken = loginResponse.data.accessToken
    console.log('✅ Login successful, got token')

    // Upload avatar
    console.log('🔍 Step 2: Upload avatar...')
    const formData = new FormData()
    formData.append('avatar', fs.createReadStream('test-avatar.png'), {
      filename: 'test-avatar.png',
      contentType: 'image/png'
    })

    const uploadResponse = await axios.patch('http://localhost:8017/v1/users', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...formData.getHeaders()
      },
      timeout: 30000
    })

    console.log('✅ Avatar upload successful!')
    console.log('Response:', uploadResponse.data)

  } catch (error) {
    console.error('❌ Avatar upload failed:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Message:', error.message)
  } finally {
    // Clean up
    fs.unlinkSync('test-avatar.png')
  }
}

testAvatarUpload()