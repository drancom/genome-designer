import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ModalWindow from '../../components//modal/modalwindow';
import SignUpForm from '../../components/authentication/signup';
import SignInForm from '../../components/authentication/signin';
import ForgotForm from '../../components/authentication/forgot';
import ResetForm from '../../components/authentication/reset';
import AccountForm from '../../components/authentication/account';
import { uiShowAuthenticationForm } from '../../actions/ui';

import '../../../src/styles/authenticationforms.css';

class AuthenticationForms extends Component {
  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
    authenticationForm: PropTypes.string,
  };

  constructor() {
    super();
  }

  render() {
    let form;
    switch (this.props.authenticationForm) {
    case 'signup' : form = <SignUpForm/>; break;
    case 'signin' : form = <SignInForm/>; break;
    case 'forgot' : form = <ForgotForm/>; break;
    case 'reset' : form = <ResetForm/>; break;
    case 'account' : form = <AccountForm/>; break;
    default: form = null; break;
    }

    let modal = null;
    if (form) {
      modal = (<ModalWindow
                open
                title="Auth Modal"
                payload={form}
                closeOnClickOutside
                closeModal={(buttonText) => {
                  this.props.uiShowAuthenticationForm('none');
                }}
              />);
    }

    return (
      <div>
        {modal}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticationForm: state.ui.authenticationForm,
  };
}

export default connect(mapStateToProps, {
  uiShowAuthenticationForm,
})(AuthenticationForms);
