import React, { useEffect } from 'react';

const IndexPage = (props) => {
  useEffect(() => {
    const token = localStorage.getItem('CC_Token');
    if (!token) {
      props.history.push('/login');
    } else {
      props.history.push('/dashboard');
    }
  }, []);
  return <div>Index</div>;
};

export default IndexPage;
