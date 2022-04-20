import React from 'react'

function WithFiltersLoading(Component) {
  return function WihLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />
    return (
      <p className='txt-sm'>
        Loading filters..
      </p>
    )
  }
}
export default WithFiltersLoading