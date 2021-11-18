import React from 'react'
const PageNotFound = () => {

  //Disable Right click
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
  }

  return (<div>
    <center>
      <h3>
        Page Not Found
        </h3>
      <small>
        This action has been recorded
        </small>
    </center>
  </div>
  )
}

export default PageNotFound;