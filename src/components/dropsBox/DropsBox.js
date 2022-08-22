import { TextareaAutosize } from "@mui/material";
import React, { useState } from "react";
import AvatarContainer from "../avatarContainer/AvatarContainer";
import { UilImages } from "@iconscout/react-unicons";
import { useStateAuth } from "../../context/Auth";
import DropFile from "./DropFile";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  updateDoc
} from "firebase/firestore";

import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";
import { async } from "@firebase/util";

const DropsBox = () => {
  const [dropData, setDropData] = useState({ dropText: "", files: null });
  const [errorInput, setErrorInput] = useState({ fileLength: "" });
  const {userProfile: user} = useStateAuth()
  const { dropText, files } = dropData;
  var fileLength = dropData?.files ? Object.keys(dropData?.files).length : 0;

  const handleChangeText = (e) => {
    setDropData({ ...dropData, dropText: e.target.value });
  };

  const handleFileChange = (e) => {
    if (fileLength > 4)
      return setErrorInput({
        ...errorInput,
        fileLength: "You can upload a maximum of four pictures at once",
      });
    
    const filesList = Object.keys(e.target.files).map(
      (key) => e.target.files[key]
    );
    setErrorInput({ ...errorInput, fileLength: "" });
    setDropData({ ...dropData, [e.target.name]: filesList });
  };

  const cancelPrevImage = (index) => {
    console.log(index);
    setDropData({ ...dropData, files: files.filter((file, i) => index !== i) });
  };

  const uploadFile = async(pic)=>{
    const imgRef = ref(storage, `dropImg/${new Date().getTime()}-${pic.name}`)
    const snap = await uploadBytes(imgRef, pic)
    const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath));
    return dlurl
  }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!(dropText.trim() || files)) return
    // const user2 = chat.uid
    // const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    let fileUrl = []

    if (files){
        for (let file of files){
          const url = await uploadFile(file)
          fileUrl.push(url)
        }

    }

    await addDoc(collection(db, 'drop'),{
      authorId: user.uid,
      comments: 0,
      dropFilePath: fileUrl,
      createdAt: Timestamp.fromDate(new Date()),
      dropText,
      likes:[]
    })

    setDropData({ dropText: '', files: null });
  }
  // TODO: CLEANSE INPUT AND HANDLE ERRORS;

  return (
    <div className="w-full px-4 py-4 flex justify-center">
      {/* AVATAR */}
      <AvatarContainer user={user} />

      {/* DROPS FORM FOR CREATING DROPS */}
      <form className="w-full px-4 flex flex-col items-center">
        <div className="flex items-end justify-start w-full gap-3 mb-2">
          <div>
            <input
              className="hidden"
              placeholder="Enter Image URL"
              type="file"
              onChange={(e) => handleFileChange(e)}
              name="files"
              id="dropbox_imgIn"
              multiple
              accept="image/*"
            />
            <label htmlFor="dropbox_imgIn" className="cursor-pointer">
              <UilImages
                className="text-textColor"
                style={{ fontSize: "10rem" }}
              />
            </label>
          </div>
          <TextareaAutosize
            minRows={3}
            className="border-[.2px] border-black/20 rounded-md p-4 sm:w-[100%] min-w-[250px] max-w-[400px]"
            placeholder="Compose drop..."
            onChange={handleChangeText}
            value={dropText}
          />
          <button className="px-3 py-2 rounded-md bg-bodyColor text-white font-semibold text-center" onClick={handleSubmit}>
            Drop
          </button>
        </div>

        {/*error Message  */}
        <p className="text-xs text-red-500">{errorInput.fileLength}</p>
        {/* image preview */}
        {files && (
          <div className={`relative grid grid-cols-2 grid-rows-2 gap-1 max-w-[400px] aspect-[5/3]`}>
            {dropData.files &&
              files.map((file, i) => {
                if (fileLength === 1) {
                  return (
                    <DropFile
                      onCancel={cancelPrevImage}
                      file={file}
                      key={i}
                      two_rows
                      two_cols
                      index={i}
                    />
                  );
                }
                if (fileLength === 3 && i === 0) {
                  console.log(file);
                  return (
                    <DropFile
                      onCancel={cancelPrevImage}
                      file={file}
                      two_rows
                      key={i}
                      index={i}
                    />
                  );
                }
                if (fileLength === 2) {
                  return (
                    <DropFile
                      onCancel={cancelPrevImage}
                      file={file}
                      two_rows
                      index={i}
                      key={i}
                    />
                  );
                }
                return (
                  <DropFile
                    onCancel={cancelPrevImage}
                    file={file}
                    key={i}
                    index={i}
                  />
                );
              })}
          </div>
        )}
      </form>
    </div>
  );
};

export default DropsBox;
