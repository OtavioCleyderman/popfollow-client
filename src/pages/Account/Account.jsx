import React, { useContext, useState } from "react";
import { AuthContext } from "../../AuthContext";
import "./account.scss";

import boy1 from "../../assets/avatares/boys/1.png";
import boy2 from "../../assets/avatares/boys/2.png";
import boy3 from "../../assets/avatares/boys/3.png";
import boy4 from "../../assets/avatares/boys/4.png";
import boy5 from "../../assets/avatares/boys/5.png";

import girl1 from "../../assets/avatares/girls/1.png";
import girl2 from "../../assets/avatares/girls/2.png";
import girl3 from "../../assets/avatares/girls/3.png";
import girl4 from "../../assets/avatares/girls/4.png";
import girl5 from "../../assets/avatares/girls/5.png";

import other1 from "../../assets/avatares/others/1.png";
import other2 from "../../assets/avatares/others/2.png";
import other3 from "../../assets/avatares/others/3.png";
import other4 from "../../assets/avatares/others/4.png";
import other5 from "../../assets/avatares/others/5.png";

const boyAvatars = [boy1, boy2, boy3, boy4, boy5];
const girlAvatars = [girl1, girl2, girl3, girl4, girl5];
const otherAvatars = [other1, other2, other3, other4, other5];


function Account() {
  const { logout } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [gender, setGender] = useState("boy"); 
  const [avatar, setAvatar] = useState(getRandomAvatar("boy"));

  const handleLogout = () => {
    logout();
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    setAvatar(getRandomAvatar(event.target.value));
  };

  const handleRandomAvatar = () => {
    setAvatar(getRandomAvatar(gender));
  };

 function getRandomAvatar(gender) {
    let avatarFolder;

    if (gender === "boy") {
      avatarFolder = boyAvatars;
    } else if (gender === "girl") {
      avatarFolder = girlAvatars;
    } else if (gender === "others") {
      avatarFolder = otherAvatars;
    }

    const randomAvatar = avatarFolder[Math.floor(Math.random() * avatarFolder.length)];

    return randomAvatar;
  }

  return (
    <div className="account-container">
      <h2>Perfil do Usuário</h2>
      <div className="account-profile">
        <img src={avatar} alt="Avatar" className="account-avatar" />
        <p className="account-username">Usuário: {user.name}</p>
      </div>
      <div className="gender-selection">
        <label>
          <input
            type="radio"
            value="boy"
            checked={gender === "boy"}
            onChange={handleGenderChange}
          />
          Homem
        </label>
        <label>
          <input
            type="radio"
            value="girl"
            checked={gender === "girl"}
            onChange={handleGenderChange}
          />
          Mulher
        </label>
        <label>
          <input
            type="radio"
            value="others"
            checked={gender === "others"}
            onChange={handleGenderChange}
          />
          Outros
        </label>
      </div>
      <button onClick={handleRandomAvatar}>Trocar avatar</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Account;