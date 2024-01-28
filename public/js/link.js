function getUser() {
    let name = document.getElementsByClassName("welcomeUser")[0];
    name.innerText += ` ${localStorage.getItem("userName")}`;
  }
  
  getUser();

  