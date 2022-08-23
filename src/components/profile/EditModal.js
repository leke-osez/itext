import { TextareaAutosize, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProfilePic from "./ProfilePic";
import { storage, db, auth } from "../../lib/firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useStateAuth } from "../../context/Auth";

const EditModal = ({ image }) => {
  const [pic, setPic] = useState(image ? image : "");

  const { setUser, user, setUserProfile, userProfile, setEditModal } = useStateAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [isPhotoEdit, setIsPhotoEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // hold previous state where state gets cleared
  const [prevprofile, setPrevProfile] = useState({
    name: userProfile?.name,
    bio: userProfile?.bio,
  });

  const [profile, setProfile] = useState({
    name: userProfile?.name,
    bio: userProfile?.bio,
    avatar: userProfile?.avatar,
    bgImg: userProfile?.bgImg,
    prevavatar: userProfile?.avatar,
    prevbgImg: userProfile?.bgImg,
  });

  const { name, bio, prevavatar, prevbgImg,avatar,bgImg } = profile;

  const handleChange = (e)=>{
        
    if (e.target.type === 'file'){
        var binaryData = [];
        binaryData.push(e.target.files[0]);
        return setProfile({
            ...profile, 
            [e.target.name]: e.target.files[0],
            [`prev` + e.target.name]: URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
        })

    }
    
    setProfile({...profile,[e.target.name]:e.target.value})
    if(e.target.name === 'name' && e.target.value !== ''){
      setIsValid(true)
    }
}

 
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

  const handleSave = ()=>{
    const id = auth?.currentUser?.uid

      // CHECK FOR CHANGES IN THE FORM FIELD
       const changes = {}
        Object.keys(profile).forEach(item=>{
          if ((profile[item] === userProfile[item]) ){
            
            changes[item] = profile[item]
          }
        })
        console.log(changes)
      const uploadPic = async () => {

        const fileData =  {avatarSnap:null, avatarUrl:null, bgImgSnap:null, bgImgUrl: null}
        if (changes.avatar){
          const avatarRef = ref(
            storage,
            `avatar/${new Date().getTime()}-${pic.name}`
          );

          try {
             fileData.avatarSnap = await uploadBytes(avatarRef, pic);
             fileData.avatarUrl = await getDownloadURL(ref(storage, fileData.avatarSnap.ref.fullPath));
          } catch (err) {
            console.log(err);
          }
        }

        if (changes.bgImg){
          const bgImgRef = ref(
            storage,
            `bgImg/${new Date().getTime()}-${pic.name}`
          );
          try {
            fileData.bgImgSnap = await uploadBytes(bgImgRef, pic);
            fileData.bgImgUrl = await getDownloadURL(ref(storage, fileData.bgImgSnap.ref.fullPath));
          } catch (err) {
            console.log(err);
          }
        }

        try {
          const data = {};
          Object.keys(changes).forEach(change=>{
           if (change !== 'avatar' || change !== 'bgImg') data[change] = changes[change]
          })
          Object.keys(fileData).forEach(file=>{
            if (fileData[file]) data[file] = fileData[file]
           })
          
           console.log(data)
          // updateDoc(doc(db, "users", auth.currentUser.uid), data).then(() => {
          //   setUserProfile({
          //     ...userProfile,
          //     data
          //   });
          //   setProfile({
          //     ...profile,
          //     data,
          //   });
          //   setIsLoading(false);
          // });
        } catch (err) {
          console.log(err);
        }
        // try {
        //   if (userProfile.avatarPath) {
        //     await deleteObject(ref(storage, userProfile.avatarPath));
        //   }
        // } catch (err) {
        //   console.log(err);
        // }
      };

      uploadPic();
    
    setPic("");
  }

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

  const handleCancel = () => {
    if (!name.trim()) {
      setProfile({ prevprofile });
    }
    setIsEdit(false);
  };

  const clearBgImg = ()=>{
    setProfile({...profile, prevbgImg: '', bgImg: ''})
  }

  // form validity checker
  useEffect(()=>{
    if (!name.trim()) {
      setIsValid(false);
    }
  },[name]);

    useEffect(() => {
      const id = auth?.currentUser?.uid
      
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
    }, [pic,]);

  return (
    <div className="w-[15rem] sm:w-[25rem] md:w-[30rem] p-3 bg-white ">
      <ProfilePic
        setProfile 
        AVI={prevavatar}
        bgImgURL = {prevbgImg}
        bgImgFor="input_bgImg"
        profileImgFor="input_profileImg"
        clearBgImg={clearBgImg}
      />
      <input
        type="file"
        onChange={handleChange}
        name="avatar"
        id="input_profileImg"
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        onChange={handleChange}
        name="bgImg"
        id="input_bgImg"
        className="hidden"
        accept="image/*"
      />
      {/* EDIT PROFILE FIELDS */}
      <div className="w-full flex flex-col items-center">
        <div>
          <div className="mt-[4rem] mb-3">
            <TextField
              type="text"
              name="name"
              label="Name"
              value={name}
              onChange={handleChange}
            />
            {!isValid && <p className="text-red-800">Name field cannot be empty</p>}
          </div>
          <div>
            <p className="font-semibold">Bio</p>

            <div className="border-2 w-fit p-2">
              <TextareaAutosize
                type="text"
                name="bio"
                label="bio"
                value={bio}
                minRows={3}
                onChange={handleChange}
                style={{ width: 300, outline: "none" }}
                placeholder="Say something about you..."
              />
            </div>
          </div>
        </div>

        <div className="absolute top-2 right-3">
          <p
            onClick={isValid ? handleSave : ()=>{}}
            className={`bg-black text-white rounded-full py-1 px-2 ${!isValid && 'bg-gray-500'}`}

          >
            Save
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
