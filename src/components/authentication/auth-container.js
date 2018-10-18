// React
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Components
import Login from './login';
import Signup from './signup';

// Styles

export function AuthContainer(props) {
  console.log(props.loggedIn);
  if (props.loggedIn) {
    console.log('we here');
    return <Redirect to="/" />;
  }

  console.log(props.match.path);
  if (props.match.path === '/login') {
    return (
      <div>
        <Login />
      </div>
    );
  }

  return (
    <div>
      <Signup />
    </div>
  );
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});
export default connect(mapStateToProps)(AuthContainer);
