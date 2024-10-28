import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://anakkix.cn" target="_blank" rel="noopener noreferrer">
            <strong>AnakkiX</strong>
        </a>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
          &
          <a href="https://anakkix.cn" target="_blank" rel="noopener noreferrer">
              AnakkiX
          </a>
          &
          <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">
              ChatGPT
          </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
