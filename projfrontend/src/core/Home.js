import React from 'react';

import "../styles.css"
import Base from './Base';

const Home = () => {
  console.log(process.env.REACT_APP_BACKEND);

  return (
      <div>
          <h1 className='text-white'>Hello</h1>
          <Base/>
      </div>
  )
}

export default Home;
