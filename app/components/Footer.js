import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className='footer bg-gray-800 text-white text-center p-4'>
            <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        </footer>
    </div>
  )
}

export default Footer
