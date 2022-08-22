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
import {useParams} from 'react-router-dom'
import { useStateAuth } from "../context/Auth";
import { borderColor } from "@mui/system";
import { DeleteForeverRounded, Edit } from "@mui/icons-material";

const Profile = ({ image }) => {
  const [pic, setPic] = useState(image ? image : "");

  const {userId} = useParams()

  const { setUser, user, setUserProfile, userProfile } = useStateAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [isPhotoEdit, setIsPhotoEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!name?.trim()) return handleCancel()
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      name,
      bio,
    }).then(() => {
      getDoc(doc(db, "users", auth.currentUser.uid)).then((docsnap) => {
        if (docsnap.exists) {
          setUserProfile(docsnap.data());
          setPrevProfile(profile)
          setIsLoading(false);
          setIsEdit(false)
        }
      });
    });
  };

  const deletePhoto = async()=>{
    try {
      const confirm = window.confirm('Delete Avatar?')
      if (userProfile.avatarPath && confirm) {
        await deleteObject(ref(storage, userProfile.avatarPath));
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: '',
          avatarPath: '',
        }).then(() => {
          
              setUserProfile({...userProfile, avatar: '',
                avatarPath: '',});
              setIsLoading(false);
            }
            )
      }
        
    } catch (err) {
      console.log(err);
    }

    
    
  }

  const handleCancel = ()=>{
    if (!name.trim()){
      setProfile({prevprofile})
    }
    setIsEdit(false)

  }

  useEffect(() => {
      const id = userId === auth.currentUser.uid ? auth.currentUser.uid : userId
      getDoc(doc(db, "users", id)).then((docsnap) => {
      if (docsnap.exists) {
         setProfile({...profile, ...docsnap.data()})
        if (userId === auth.currentUser.uid) setUserProfile({...userProfile, ...docsnap.data()})

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
            
                setUserProfile({...userProfile, avatar: url,
                  avatarPath: snap.ref.fullPath,});
                setProfile({...profile, avatar: url,
                  avatarPath: snap.ref.fullPath,});
                setIsLoading(false);
              }
              )
            
          
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
  }, [pic,userId]);



  if (profile ) {
    return (
      <div className="flex justify-center mt-6 md:mt-10 h-screen w-full" onClick={()=>setIsPhotoEdit(false)}>
        <div className="flex flex-col justify-start items-start px-3">
          <div className="flex items-end mb-4 relative ">
            <div className="relative w-fit h-fit">
              <Avatar src={profile.avatar } className="profile_avatar" />
              {isLoading && (
                <div className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
                  <CircularProgress />
                </div>
              )}
            </div>
              <div className={`relative h-[30px] text-sm ${userId !== user.uid ? 'hidden' : ''}`}>
                <button onClick={(e)=>{
                  e.stopPropagation()
                  setIsPhotoEdit(true)}}><Edit/></button>
                {isPhotoEdit && 
                <div className="absolute top-[31px] min-w-[100px] bg-white shadow-md z-[20] flex flex-col gap-3 p-2 cursor-pointer"
                onClick={(e)=>{
                  e.stopPropagation()
                 }}
                >
                  <label htmlFor="pic" className="flex w-fit">
                    <p>Set photo</p>
                  </label>
                  <div>
                    <p onClick = {deletePhoto}>Delete </p>
                  </div>
                </div>
                }
              </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              name="pic"
              id="pic"
              onChange={handleChangePic}
            />
          <div className={`h-full ${userId !== user.uid ? 'hidden' : ''}`} >
            {isEdit ? (
          <p onClick={handleCancel} className="text-red-600 h-fit cursor-pointer">
            Cancel
          </p>
        ) : (
          <p onClick={() => setIsEdit(true)} className="text-green-600 h-fit cursor-pointer">
            Edit
          </p>
        )}
        </div>
          </div>
          <p className="text-black/70 mb-2 font-semibold">
            Joined on:{" "}
            <span className="text-sm font-normal">
              {profile?.createdAt?.toDate()?.toDateString()}
            </span>
          </p>

          <div className="mb-3">
            {isEdit ? (
              <TextField
                type="text"
                name="name"
                label="name"
                value={name}
                onChange={handleChangeText}
              />
            ) : (
              <div className="flex gap-4">
                <p className="font-semibold">@{userId === user.uid ? userProfile?.name : profile?.name}</p>
              </div>
            )}
          </div>
          <div>
          <p className="font-semibold">Bio</p>
            {isEdit ? (
              <>

                <TextareaAutosize
                  type="text"
                  name="bio"
                  label="bio"
                  value={bio }
                  minRows={3}
                  onChange={handleChangeText}
                  style={{ width: 200, border: 2, borderColor: "gray" }}
                  placeholder="Say something about you..."
                />
              </>
            ) : (
              <div>
                <p className="w-100px">
                  {userId === user.uid ? userProfile?.bio : profile?.bio}
                </p>
              </div>
            )}
          </div>
          {isEdit ? (
            <div className="w-full">
              <p
                onClick={handleSaveText}
                className="float-right bg-orange-500 text-white rounded-full py-1 px-2"
              >
                Save
              </p>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* <div>
          <p>Gallery</p>
        </div> */}
        
      </div>
    );
  } else return null;
}

export default Profile;
