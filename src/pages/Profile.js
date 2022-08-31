import React, { useEffect, useRef, useState } from "react";
import { storage, db, auth } from "../lib/firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import {
  getDoc,
  doc,
  updateDoc,
  setDoc,
  writeBatch,
  limit,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { Link, useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import { useStateAuth } from "../context/Auth";
import ProfilePic from "../components/profile/ProfilePic";
import TabTitle from "../components/profile/TabTitle";
import { UilEnvelope } from "@iconscout/react-unicons";
import { getDrops } from "../lib/utils";
import ProfileContents from "../components/profile/ProfileContents";

const Profile = ({ image }) => {
  const { userId, location } = useParams();
  const locationPath = useLocation().pathname
  const countRef = useRef(0);
  const {
    user,
    setUserProfile,
    userProfile,
    setEditModal,
    profile,
    setProfile,
    setProfileContents,
    profileContents,
    setChat,
    setMsgs,
    setChatList
  } = useStateAuth();

  const navigate = useNavigate()
  const [activeState, setActiveState] = useState(null);
  const isFollowing = () => {
    const index = userProfile?.following?.findIndex(
      (follow) => follow === userId
    );

    if (index === -1) {
      return false;
    }
    return true;
  };

  const handleFollow = async (id) => {
    const batch = writeBatch(db);
    const userId = userProfile?.uid;

    const userToFollowRef = doc(db, "users", id);
    const userRef = doc(db, "users", userId);

    const userToFollow = profile;
    const userToFollowFollowers = userToFollow.followers;

    const following = userProfile?.following;

    const userIndex = following.findIndex((follow) => follow === id);
    const userToFollowFollowersIndex = userToFollowFollowers.findIndex(
      (follow) => follow === userId
    );

    if (userIndex === -1) {
      following.push(id);
      userToFollowFollowers.push(userId);

      batch.update(userRef, {
        following,
      });
      batch.update(userToFollowRef, {
        followers: userToFollowFollowers,
      });
    } else {
      following.splice(userIndex, 1);
      userToFollowFollowers.splice(userToFollowFollowersIndex, 1);

      batch.update(userRef, {
        following,
      });
      batch.update(userToFollowRef, {
        followers: userToFollowFollowers,
      });
    }

    await batch.commit();
    setProfile({ ...profile, followers: userToFollowFollowers });
  };

  const sendMessage = ()=>{
    if (!profile) return
    setChatList(false)
    setMsgs([])
    setChat(profile)
    navigate('/chat')
  

  }
  useEffect(() => {
    
    getDoc(doc(db, "users", userId)).then((docsnap) => {
      if (docsnap.exists) {
        setProfile(docsnap.data() );
        if (userId === auth.currentUser?.uid) setProfile({ ...userProfile, ...docsnap.data() });
      }
    });
  }, [userId, ]);

  useEffect(() => {
    setActiveState({ [location]: true });
  }, [location]);

  useEffect(() => {
    if (!userProfile) return

    const getFilteredDrops = () => {
      const dropsRef = collection(db, "drop");
      
      // PREVIOUS PROFILE STATES
      setProfileContents({})

      if (location === "media") {
        const q = query(
          dropsRef,
          where("authorId", "==", userId),
          where("dropFilePath", "!=", false),
          orderBy("dropFilePath"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        return getDrops(countRef, setProfileContents, q, location);
      }

      if (location === "likes") {
        const q = query(
          dropsRef,
          where("likes", "array-contains", userId), 
          orderBy("createdAt", "desc"),
          limit(20)
        );
        return getDrops(countRef, setProfileContents, q, location);
      }
      
      const q = query(
        dropsRef,
        where("authorId", "==", userId),
        orderBy('createdAt', 'desc'),
        limit(20),       
      );

      getDrops(countRef, setProfileContents, q, location);
    };

    getFilteredDrops();
  }, [location, userProfile, userId]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  if (profile) {
    return (
      <div className="dark:text-white/90 ">
        <ProfilePic AVI={profile?.avatar} bgImgURL={profile?.bgImg} />
        {userId === auth.currentUser?.uid ? (
          <button
            className="mt-2 px-2 dark:border-white/90 text-base  rounded-full border-black/70 border-[.05rem] float-right md:font-medium mr-3"
            onClick={() => {
              setEditModal(true);
            }}
          >
            Edit Profile
          </button>
        ) : (
          <span className="float-right mt-2 flex items-center gap-2 ">
            <button onClick={sendMessage}>
              <UilEnvelope />
            </button>
            {!isFollowing() ? (
              <button
                className=" px-2 text-base bg-black text-white rounded-full  border-[.05rem] mr-3 "
                onClick={() => handleFollow(profile?.uid)}
              >
                Follow
              </button>
            ) : (
              <button
                className=" px-2 text-base  bg-gray-400 text-white rounded-full  border-[.05rem] mr-3"
                onClick={() => handleFollow(profile?.uid)}
              >
                Unfollow
              </button>
            )}
          </span>
        )}

        <div className="flex justify-start w-full mt-[10%]">
          <div className="flex flex-col justify-start items-start px-3 mt-4 w-full">
            {/* NAME */}
            <div className="mb-3">
              <div className="flex gap-4">
                <p className="font-semibold">
                  @{userId === user?.uid ? userProfile?.name : profile?.name}
                </p>
              </div>
            </div>

            {/* BIO */}
            <div className="w-full">
              <p className="font-semibold">Bio</p>

              <p className="w-[70%]">
                {userId === user?.uid ? userProfile?.bio : profile?.bio}
              </p>
            </div>

            {/* DATE JOINED */}
            <p className="text-black/70 dark:text-white/80 mb-2 font-semibold mt-3">
              Joined{" "}
              <span className="text-sm font-normal">
                {profile?.createdAt?.toDate()?.toDateString()}
              </span>
            </p>

            <div className="flex gap-2">
              <button className="flex gap-1">
                {profile?.following?.length}{" "}
                <p className="text-black/70 dark:text-white/70">Following</p>
              </button>
              <button className="flex gap-1">
                {profile?.followers?.length}{" "}
                <p className="text-black/70 dark:text-white/70">Followers</p>
              </button>
            </div>
          </div>
        </div>
        <div className="profilePage__body">
          <div className="profilePage__pageTitle flex justify-around">
            <Link to={``} replace={true}>
              <TabTitle text="Drops" isActive={!location} name="drops" />
            </Link>
            {/* <Link to="with_replies" replace={true}>
              <TabTitle
                text="drops & replies"
                isActive={activeState?.with_replies}
                name="dropsNR"
              />
            </Link> */}
            <Link to="media" replace={true}>
              <TabTitle
                text="Media"
                isActive={activeState?.media}
                name="media"
              />
            </Link>
            <Link to="likes" replace={true}>
              <TabTitle
                text="Likes"
                isActive={activeState?.likes}
                name="likes"
              />
            </Link>
          </div>
          <section>
            {location ? <Outlet /> : <ProfileContents profileContents = {profileContents}/>}
          </section>
        </div>
      </div>
    );
  } else return null;
};

export default Profile;
