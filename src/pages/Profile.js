import { Camera } from "@mui/icons-material";
import { Avatar, TextField } from "@mui/material";
import React, { useState } from "react";
import { storage, db, auth } from "../lib/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";

const Profile = ({ image }) => {
  const [profile, setProfile] = useState({
    name: "Skipper",
    pic: image ? image : "",
    bio: "bio",
    prevPic: image ? image : "",
  });
  const { pic, name, bio } = profile;

  const handleChangePic = async (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.files[0] });
    const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${pic.name}`);
    console.log(pic);
    // try {
    //   const snap = await uploadBytes(imgRef, pic);
    //   const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

    //   //   await updateDoc(doc(db, "users", auth.currentUser.uid), {
    //   //     avatar: url,
    //   //     avatarPath: snap.ref.fullPath,
    //   //   });
    // } catch (err) {
    //   console.log(err);
    // }

    setProfile({ ...profile, [e.target.name]: "" });
  };

  const handleChangeText = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSaveText = async (e) => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      name,
      bio,
    });
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-start items-center">
        <div className="md:w-[100px] w-[50px] aspect-square relative">
          <Avatar src={""} />
          <div className="w-[50%] aspect-square absolute top-0 right-0 left-0 bottom-0 m-auto z-[2]">
            <label htmlFor="pic">
              <Camera />
            </label>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            name="pic"
            id="pic"
            onChange={handleChangePic}
            value={pic}
          />
        </div>

        <TextField
          type="text"
          name="name"
          value={name}
          onChange={handleChangeText}
        />
        <TextField
          type="text"
          name="bio"
          label="bio"
          value={bio}
          onChange={handleChangeText}
        />
        <p>Joined on</p>
      </div>
      <button
        onClick={handleSaveText}
        className="bg-green-500 w-[50px] h-fit py-2 font-bold text-white rounded-full"
      >
        Save
      </button>
    </div>
  );
};

export default Profile;
