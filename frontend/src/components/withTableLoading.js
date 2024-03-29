import React from 'react'

function WithTableLoading(Component) {
  return function WihLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />
    return (
      <p className='txt-sm'>
        Loading table..
      </p>
    )
  }
}
export default WithTableLoading