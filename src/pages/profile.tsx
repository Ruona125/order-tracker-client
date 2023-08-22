import React from 'react';
import { useSelector } from 'react-redux';
// import { RootState } from '../Redux/rootReducer';

const Profile: React.FC = () => {
  const { email, name, roles, user_id, reset_token } = useSelector((state: any) => state.user.userDetails);

  return (
    <div>
      <h2>this is the profile page</h2>
      <h2>email: {email}</h2>
      <h2>name: {name}</h2>
      <h3>roles: {roles}</h3>
      <h3>id: {user_id}</h3>
      <h3>reset token: {reset_token}</h3>
    </div>
  );
};

export default Profile;
