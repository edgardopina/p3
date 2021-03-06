import React from 'react';

//* Redirect, will allow us to redirect the user to another route within the application. Think of it like how we've
//* used location.replace() in the past, but it leverages React Router's ability to not reload the browser!
import { Redirect, useParams } from 'react-router-dom';

import { ADD_FRIEND } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client'; //* hooks

import { QUERY_USER, QUERY_ME } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

import Auth from '../utils/auth';

const Profile = (props) => {
   //* Add Friend button onClick handler
   const handleClick = async () => {
      try {
         await addFriend({
            variables: { id: user._id },
         });
      } catch (err) {
         console.error(err);
      }
   };

   const [addFriend] = useMutation(ADD_FRIEND);
   const { username: userParam } = useParams();

   const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
      variables: { username: userParam },
   });

   const user = data?.me || data?.user || {};

   //* redirect to personal profile page if username is yours
   //* Let's now add functionality to the Profile component definition to check if the logged-in user's username is
   //* the same as the parameter, and redirect if so.
   //! redirect to personal profile page if username is the logged-in user's
   if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
      return <Redirect to='/profile' />;
   }

   if (loading) {
      return <div>Loading...</div>;
   }

   if (!user?.username) {
      return <h4>You need to be logged in to see this page. Use the navigation links above to sign up or log in!</h4>;
   }

   //* conditionally renders Add Friend button for other users only
   return (
      <div>
         <div className='flex-row mb-3'>
            <h2 className='bg-dark text-secondary p-3 display-inline-block'>
               Viewing {userParam ? `${user.username}'s` : 'your'} profile.
            </h2>
            {userParam && (
               <button className='btn ml-auto' onClick={handleClick}>
                  Add Friend
               </button>
            )}
         </div>

         <div className='flex-row justify-space-between mb-3'>
            <div className='col-12 mb-3 col-lg-8'>
               <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`}></ThoughtList>
            </div>

            <div className='col-12 col-lg-3 mb-3'>
               <FriendList username={user.username} friendCount={user.friendCount} friends={user.friends}></FriendList>
            </div>
         </div>
         <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
      </div>
   );
};

export default Profile;
