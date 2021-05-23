import React, {Component} from 'react';
import { Switch, Route }  from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import Dashboard from './Dashboard/Dashboard';
import LandingPage from './LandingPage/LandingPage';
import Profile from './Profile/Profile';
import MyGroups from './Groups/MyGroups';
import Activities from './Activity/Activities';
import CreateGroup from './Groups/CreateGroup'
import GroupPage from './Groups/GroupPage';
import GroupProfile from './Groups/GroupProfile';
import GroupInvite from './Groups/GroupInvite';

//Create a Main Component
const Main = () => {
    
    return(
        <div>
            <Switch>
                {/*Render Different Component based on Route*/}
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/signup">
                    <Signup/>
                </Route>
                <Route path="/dashboard">
                    <Dashboard/>
                </Route>
                <Route path="/profile">
                    <Profile/>
                </Route>
                <Route path="/mygroups">
                    <MyGroups/>
                </Route>
                <Route path="/grouppage">
                    <GroupPage/>
                </Route>
                <Route path="/groupprofile">
                    <GroupProfile/>
                </Route>
                <Route path="/create">
                    <CreateGroup/>
                </Route>
                <Route path="/groupinvite">
                    <GroupInvite/>
                </Route>
                <Route path="/activities">
                    <Activities/>
                </Route>
                {/*Root path should be put at last*/}
                <Route path="/">
                    <LandingPage/>
                </Route>
            </Switch>
        </div>
    )
    
}
//Export The Main Component
export default Main;