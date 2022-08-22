import React, { useEffect, useState } from "react";
import { storage, db, auth } from "../lib/firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Avatar,
  CircularProgress,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Link, Outlet, useParams } from "react-router-dom";
import { useStateAuth } from "../context/Auth";
import { borderColor } from "@mui/system";
import { DeleteForeverRounded, Edit } from "@mui/icons-material";
import ProfilePic from "../components/profile/ProfilePic";
import TabTitle from "../components/profile/TabTitle";

const Profile = ({ image }) => {
  const [pic, setPic] = useState(image ? image : "");

  const { userId } = useParams();

  const { setUser, user, setUserProfile, userProfile, setEditModal } =
    useStateAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileHeight, setProfileHeight] = useState(0);
  console.log(profileHeight);

  // hold previous state where state gets cleared
  const [prevprofile, setPrevProfile] = useState({
    name: userProfile?.name,
    bio: userProfile?.bio,
  });

  const [profile, setProfile] = useState({
    name: userProfile?.name,
    bio: userProfile?.bio,
    prevPic: image ? image : "",
  });
  const { name, bio } = profile;

  const handleChangePic = (e) => {
    setPic(e.target.files[0]);
    setIsLoading(true);
  };

  const handleChangeText = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSaveText = async (e) => {
    if (!name?.trim()) return handleCancel();
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      name,
      bio,
    }).then(() => {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((docsnap) => {
        if (docsnap.exists) {
          setUserProfile(docsnap.data());
          setPrevProfile(profile);
          setIsLoading(false);
          setIsEdit(false);
        }
      });
    });
  };

  const deletePhoto = async () => {
    try {
      const confirm = window.confirm("Delete Avatar?");
      if (userProfile.avatarPath && confirm) {
        await deleteObject(ref(storage, userProfile.avatarPath));
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        }).then(() => {
          setUserProfile({ ...userProfile, avatar: "", avatarPath: "" });
          setIsLoading(false);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [activeState, setActiveState] = useState({ tweets: true });

  const handleCancel = () => {
    if (!name.trim()) {
      setProfile({ prevprofile });
    }
    setIsEdit(false);
  };

  useEffect(() => {
    const id = userId === auth.currentUser.uid ? auth.currentUser.uid : userId;
    getDoc(doc(db, "users", id)).then((docsnap) => {
      if (docsnap.exists) {
        setProfile({ ...profile, ...docsnap.data() });
        if (userId === auth.currentUser.uid)
          setUserProfile({ ...userProfile, ...docsnap.data() });
      }
    });
    if (pic) {
      const uploadPic = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()}-${pic.name}`
        );

        try {
          const snap = await uploadBytes(imgRef, pic);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          }).then(() => {
            setUserProfile({
              ...userProfile,
              avatar: url,
              avatarPath: snap.ref.fullPath,
            });
            setProfile({
              ...profile,
              avatar: url,
              avatarPath: snap.ref.fullPath,
            });
            setIsLoading(false);
          });
        } catch (err) {
          console.log(err);
        }
        try {
          if (userProfile.avatarPath) {
            await deleteObject(ref(storage, userProfile.avatarPath));
          }
        } catch (err) {
          console.log(err);
        }
      };

      uploadPic();
    }
    setPic("");
  }, [pic, userId]);

  if (profile) {
    return (
      <div>
        <ProfilePic AVI={profile?.avatar} setProfileHeight={setProfileHeight} />
        {userId === auth.currentUser.uid && (
          <button
            className="mt-2 px-4  rounded-full border-black/70 border-[.125rem] float-right md:font-medium mr-3"
            onClick={() => setEditModal(true)}
          >
            Edit Profile
          </button>
        )}

        <div className="flex justify-start w-full mt-[10%]">
          <div className="flex flex-col justify-start items-start px-3 mt-4 w-full">
            {/* NAME */}
            <div className="mb-3">
              <div className="flex gap-4">
                <p className="font-semibold">
                  @{userId === user.uid ? userProfile?.name : profile?.name}
                </p>
              </div>
            </div>

            {/* BIO */}
            <div className="w-full">
              <p className="font-semibold">Bio</p>

              <p className="w-[70%]">
                {userId === user.uid ? userProfile?.bio : profile?.bio}
              </p>
            </div>

            {/* DATE JOINED */}
            <p className="text-black/70 mb-2 font-semibold mt-3">
              Joined{" "}
              <span className="text-sm font-normal">
                {profile?.createdAt?.toDate()?.toDateString()}
              </span>
            </p>

            <div className="flex gap-2">
              <button className="flex gap-1">
                {profile?.following?.length}{" "}
                <p className="text-black/70">Following</p>
              </button>
              <button className="flex gap-1">
                {profile?.followers?.length}{" "}
                <p className="text-black/70">Followers</p>
              </button>
            </div>
          </div>
        </div>
        <div className="profilePage__body">
          <div className="profilePage__pageTitle flex justify-around">
            <Link to={`tweets`} replace={true}>
              <TabTitle
                text="Tweets"
                isActive={activeState?.tweets}
                name="tweets"
              />
            </Link>
            <Link to="with_replies" replace={true}>
              <TabTitle
                text="Tweets & replies"
                isActive={activeState?.with_replies}
                name="tweetsNR"
              />
            </Link>
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
            <Outlet />
          </section>
        </div>
      </div>
    );
  } else return null;
};

export default Profile;
