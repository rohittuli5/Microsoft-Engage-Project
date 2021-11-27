import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import ProfDashboard from "./ProfDashboard";
import StudentDashboard from "./StudentDashboard";

/**
 * This is a common class for student as well as professor dashboard
 * This is called from login directly
 * Based on the type of user it renders the StudentDashboard Component or
 * ProfDashboard Component 
 */
class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
    const { user } = this.props.auth;
    console.log(user);
    
return (
      <div >
      {user.userType===true?<ProfDashboard name={user.name} prof_email={user.email} logoutUser={this.props.logoutUser}/>:
      <StudentDashboard name={user.name} student_email={user.email} logoutUser={this.props.logoutUser}/>}
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);