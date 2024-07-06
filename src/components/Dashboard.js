import React, { useState, useEffect } from "react";
import Web3 from "web3";
import moment from "moment";
import {
  contractAddress,
  abi,
  examAddress,
  examABI,
  stableCoinAddress,
  stableCoinABI,
} from "./../utils/contract"; // Import from contract.js

const Dashboard = () => {
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [networkId, setNetworkId] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [examInstance, setExamInstance] = useState(null);
  const [stableCoinInstance, setStableCoinInstance] = useState(null);
  const [users, setUsers] = useState(null);
  const [isExamQualifier, setIsExamQualifier] = useState(false);
  const [regFee, setRegFee] = useState(null);

  // User Data
  const [isUserExist, setIsUserExist] = useState(false);
  const [userId, setUserId] = useState(null);
  const [referrerId, setUserReferrerId] = useState(null);
  const [coreferrerID, setCoreferrerID] = useState(null);
  const [referredUsers, setReferredUsers] = useState(null);
  const [coreferredUsers, setCoreferredUsers] = useState(0);
  const [income, setIncome] = useState(0);
  const [levelIncomeReceived, setLevelIncomeReceived] = useState(0);
  const [stageIncomeReceived, setStageIncomeReceived] = useState(0);
  const [currUserID, setCurrUserID] = useState(null);
  const [totalQualifiedUser, setTotalQualifiedUser] = useState(null);
  const [partnerFee, setPartnerFee] = useState(null);
  const [examQualifer, setExamQualifer] = useState(false);
  // PArtner
  const [partnerId, setPartnerId] = useState();
  const [partnerCount, setPartnerCount] = useState();
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenReward, setTokenReward] = useState();
  const [regTime, setRegTime] = useState();

  const [userLevelInfo, setUserLevelInfo] = useState([
    { level: 1, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 2, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 3, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 4, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 5, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 6, team: 0, upgradeCount: 0, upgradeStatus: false },
  ]);
  const [partnerUpgradePower, setPartnerUpgradePower] = useState([
    { level: 1, upgradePower: 0, levelPrice: 0 },
    { level: 2, upgradePower: 0, levelPrice: 0 },
    { level: 3, upgradePower: 0, levelPrice: 0 },
    { level: 4, upgradePower: 0, levelPrice: 0 },
    { level: 5, upgradePower: 0, levelPrice: 0 },
    { level: 6, upgradePower: 0, levelPrice: 0 },
  ]);
  const [userUpgradePower, setUserUpgradePower] = useState([
    { level: 1, upgradePower: 0, levelPrice: 0 },
    { level: 2, upgradePower: 0, levelPrice: 0 },
    { level: 3, upgradePower: 0, levelPrice: 0 },
    { level: 4, upgradePower: 0, levelPrice: 0 },
    { level: 5, upgradePower: 0, levelPrice: 0 },
    { level: 6, upgradePower: 0, levelPrice: 0 },
  ]);
  const [autoIncomeInfo, setAutoIncomeInfo] = useState([
    { title: "Active User ID", value: 0 },
    { title: "Current User ID", value: 0 },
    { title: "User ID", value: 0 },
    { title: "User Payment Received", value: 0 },
    { title: "User Auto Income", value: 0 },
    { title: "User Partner Pool Received", value: 0 },
    { title: "User Sponsor Pool Received", value: 0 },
  ]);
  const [partnerInfo, setPartnerInfo] = useState([
    { title: "Partner Count", value: 0 },
    { title: "Partner ID", value: 0 },
    { title: "Income", value: 0 },
    { title: "Planer Income", value: 0 },
    { title: "Level Income Received", value: 0 },
  ]);
  const [partnerLevelInfo, setPartnerLevelInfo] = useState([
    { level: 1, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 2, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 3, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 4, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 5, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 6, team: 0, upgradeCount: 0, upgradeStatus: false },
  ]);

  useEffect(() => {
    const storedAddress = localStorage.getItem("connectedAddress");
    if (storedAddress) {
      setConnectedAddress(storedAddress);
      setIsConnected(true);
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      // Fetch current network and account on load
      handleChainChanged();
      handleAccountsChanged();
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        let account = accounts[0];
        // account = "0xE8dF0d71928C22f5955f407BbEaE36232Cf83F53";
        localStorage.setItem("connectedAddress", account);
        setConnectedAddress(account);
        setIsConnected(true);
      } else {
        localStorage.removeItem("connectedAddress");
        setConnectedAddress("");
        setIsConnected(false);
      }
    }
  };

  const handleChainChanged = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setNetworkId(chainId);
      // Optionally, handle network-specific logic here
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        localStorage.setItem("connectedAddress", account);
        setConnectedAddress(account);
        setIsConnected(true);
      } catch (e) {
        if (
          e.message.includes("Returned values aren't valid") ||
          e.message.includes("Out of Gas") ||
          e.message.includes("correct ABI") ||
          e.message.includes("not fully synced")
        ) {
          alert("ON Wrong Chain");
        }
        console.error("Error caught:", e.message);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem("connectedAddress");
    setConnectedAddress("");
    setIsConnected(false);
  };
  useEffect(() => {
    const initWeb3AndContracts = async () => {
      if (connectedAddress) {
        const web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(abi, contractAddress);
        const examInstance = new web3.eth.Contract(examABI, examAddress);
        const stableInstance = new web3.eth.Contract(
          stableCoinABI,
          stableCoinAddress
        );

        setContractInstance(contractInstance);
        setExamInstance(examInstance);
        setStableCoinInstance(stableInstance);
        console.log("Connected Address is: ", connectedAddress);
        const usersData = await contractInstance.methods
          .users(connectedAddress)
          .call({ from: connectedAddress });
        setUsers(usersData);

        const isExamPassed = await examInstance.methods
          .isPass(connectedAddress)
          .call({ from: connectedAddress });
        setIsExamQualifier(isExamPassed);
      }
    };
    initWeb3AndContracts();
  }, [connectedAddress]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (contractInstance && connectedAddress) {
        const usersData = await contractInstance.methods
          .users(connectedAddress)
          .call({ from: connectedAddress });

        setIsUserExist(usersData.isExist);
        setUserId(usersData.id);
        setUserReferrerId(usersData.referrerID);
        setCoreferrerID(usersData.coreferrerID);
        setReferredUsers(usersData.referredUsers);
        setCoreferredUsers(usersData.coreferredUsers);
        setIncome(usersData.income);
        setLevelIncomeReceived(usersData.levelIncomeReceived);
        setStageIncomeReceived(usersData.stageIncomeReceived);
        const partnerFee = await contractInstance.methods
          .partnerFee()
          .call({ from: connectedAddress });
        setPartnerFee(partnerFee);
      }
    };
    fetchUserData();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const fetchRegistrationFee = async () => {
      if (contractInstance && connectedAddress) {
        const registrationFee = await contractInstance.methods
          .REGESTRATION_FESS()
          .call({ from: connectedAddress });
        setRegFee(registrationFee);
        const currUID = await contractInstance.methods
          .currUserID()
          .call({ from: connectedAddress });
        setCurrUserID(currUID);
        console.log("Registration Fee is: ", registrationFee, currUID);
        let totalQulifiedUser = await contractInstance.methods
          .totalQulifiedUser()
          .call({ from: connectedAddress });
        setTotalQualifiedUser(totalQulifiedUser);
      }
    };
    fetchRegistrationFee();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const patnerData = async () => {
      if (contractInstance && connectedAddress) {
        const partnerID = await contractInstance.methods
          .partnerID(connectedAddress)
          .call({ from: connectedAddress });
        setPartnerId(partnerID);
        const isExamQualify = await examInstance.methods
          .isPass(connectedAddress)
          .call({ from: connectedAddress });
        if (isExamQualify && partnerID == 0) {
          setExamQualifer(true);
        }

        const patnerCount = await contractInstance.methods
          .partnerCount(connectedAddress)
          .call({ from: connectedAddress });
        setPartnerCount(patnerCount);

        // console.log("Registration Fee is: ", registrationFee, currUID);
        let tokenPrice = await contractInstance.methods
          .tokenPrice()
          .call({ from: connectedAddress });
        setTokenPrice(tokenPrice);
        let tokenReward = await contractInstance.methods
          .tokenReward()
          .call({ from: connectedAddress });
        setTokenReward(tokenReward);
        let regTime = await contractInstance.methods
          .regTime(connectedAddress)
          .call({ from: connectedAddress });
        setRegTime(Number(regTime));
      }
    };
    patnerData();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const userLevelInfoCall = async () => {
      if (contractInstance && connectedAddress) {
        const fetchedData = [
          { level: 1, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 2, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 3, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 4, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 5, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 6, team: 0, upgradeCount: 0, upgradeStatus: false },
        ];

        let levels = await contractInstance.methods
          .levels(connectedAddress)
          .call({ from: connectedAddress });

        for (let i = 0; i < 6; i++) {
          let userUpgradeStatus = await contractInstance.methods
            .userUpgradeStatus(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          fetchedData[i].upgradeStatus = userUpgradeStatus;
          fetchedData[i].team = levels[i];
          let upgradeCount = await contractInstance.methods
            .upgradeCount(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          fetchedData[i].upgradeCount = upgradeCount;
        }
        setUserLevelInfo(fetchedData);
        console.log("USer level info :", userLevelInfo);
      }
    };
    userLevelInfoCall();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const partnerLevelInfo = async () => {
      if (contractInstance && connectedAddress) {
        const fetchedData = [
          { level: 1, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 2, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 3, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 4, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 5, team: 0, upgradeCount: 0, upgradeStatus: false },
          { level: 6, team: 0, upgradeCount: 0, upgradeStatus: false },
        ];

        let parLevels = await contractInstance.methods
          .parLevels(connectedAddress)
          .call({ from: connectedAddress });
        for (let i = 0; i <= 6; i++) {
          let partnerUpgradeStatus = await contractInstance.methods
            .partnerUpgradeStatus(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          let partnerUpgradeCount = await contractInstance.methods
            .partnerUpgradeCount(i, connectedAddress)
            .call({ from: connectedAddress });
          fetchedData[0].upgradeStatus = partnerUpgradeStatus ? true : false;
          fetchedData[0].team = parLevels[i];
          fetchedData[0].upgradeCount = partnerUpgradeCount;
        }
        setPartnerLevelInfo(fetchedData);
      }
    };
    partnerLevelInfo();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const autoIncome = async () => {
      if (contractInstance && connectedAddress) {
        const autoIncome = [
          { title: "Active User ID", value: 0 },
          { title: "Current User ID", value: 0 },
          { title: "User ID", value: 0 },
          { title: "User Payment Received", value: 0 },
          { title: "User Auto Income", value: 0 },
          { title: "User Partner Pool Received", value: 0 },
          { title: "User Sponsor Pool Received", value: 0 },
        ];

        let pool1activeUserID = await contractInstance.methods
          .pool1activeUserID()
          .call({ from: connectedAddress });
        // console.log("Active User id: ", pool1activeUserID);
        let pool1currUserID = await contractInstance.methods
          .pool1currUserID()
          .call({ from: connectedAddress });
        let pool1users = await contractInstance.methods
          .pool1users(connectedAddress)
          .call({ from: connectedAddress });
        autoIncome[0].value = pool1activeUserID;
        autoIncome[1].value = pool1currUserID;
        autoIncome[2].value = pool1users.id;
        autoIncome[3].value = pool1users.payment_received;
        autoIncome[4].value =
          pool1users.autoIncome > 0
            ? parseFloat(
                Web3.utils.fromWei(pool1users.autoIncome, "ether")
              ).toFixed(4)
            : 0;
        autoIncome[5].value = pool1users.PartnerPoolRecieved;
        autoIncome[6].value = pool1users.SponsorPoolRecieved;
        setAutoIncomeInfo(autoIncome);
      }
    };

    autoIncome();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const partnerInfo = async () => {
      if (contractInstance && connectedAddress) {
        const partnerInfo = [
          { title: "Partner Count", value: 0 },
          { title: "Partner ID", value: 0 },
          { title: "Income", value: 0 },
          { title: "Planer Income", value: 0 },
          { title: "Level Income Received", value: 0 },
        ];

        let partnerCount = await contractInstance.methods
          .partnerCount(connectedAddress)
          .call({ from: connectedAddress });
        let income = await contractInstance.methods
          .income(connectedAddress)
          .call({ from: connectedAddress });
        // console.log("Income is **********   : ", income);
        partnerInfo[0].value = partnerCount;
        partnerInfo[1].value = partnerId;
        partnerInfo[2].value =
          income.income > 0
            ? parseFloat(Web3.utils.fromWei(income.income, "ether")).toFixed(4)
            : 0;
        partnerInfo[3].value = income.planer;
        partnerInfo[4].value = income.levelIncomeReceived;
        setPartnerInfo(partnerInfo);
      }
    };

    partnerInfo();
  }, [contractInstance, connectedAddress]);

  //   async function partnerInfo() {
  //     partnerCount = await contractInstance.methods
  //       .partnerCount(connectedAddress)
  //       .call({ from: connectedAddress });
  //     let income = await contractInstance.methods
  //       .income(connectedAddress)
  //       .call({ from: connectedAddress });
  //     console.log("Income is **********   : ", income);

  //     document.getElementById("partnerCount").innerText = partnerCount;
  //     document.getElementById("partnerID").innerText = partnerID;
  //     document.getElementById("partnerID1").innerText = partnerID;

  //     document.getElementById("income1").innerText =
  //       (await weiToEth(income.income)) + " USDT";

  //     document.getElementById("planerIncome").innerText = income.planer;

  //     document.getElementById("levelIncomeReceived1").innerText =
  //       income.levelIncomeReceived;
  //   }

  useEffect(() => {
    const userPartnerUpgradeStatus = async () => {
      if (contractInstance && connectedAddress) {
        const patnerUpgradePower = [
          { level: 1, upgradePower: 0, levelPrice: 0 },
          { level: 2, upgradePower: 0, levelPrice: 0 },
          { level: 3, upgradePower: 0, levelPrice: 0 },
          { level: 4, upgradePower: 0, levelPrice: 0 },
          { level: 5, upgradePower: 0, levelPrice: 0 },
          { level: 6, upgradePower: 0, levelPrice: 0 },
        ];
        const userUpgradePower = [
          { level: 1, upgradePower: 0, levelPrice: 0 },
          { level: 2, upgradePower: 0, levelPrice: 0 },
          { level: 3, upgradePower: 0, levelPrice: 0 },
          { level: 4, upgradePower: 0, levelPrice: 0 },
          { level: 5, upgradePower: 0, levelPrice: 0 },
          { level: 6, upgradePower: 0, levelPrice: 0 },
        ];

        for (let i = 0; i < 6; i++) {
          let upgradePower = await contractInstance.methods
            .upgradePower(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          let levelPrice = await contractInstance.methods
            .LEVEL_PRICE(i + 1)
            .call({ from: connectedAddress });
          let partnerUpgradePower = await contractInstance.methods
            .partnerUpgradePower(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          upgradePower =
            upgradePower > 0
              ? parseFloat(Web3.utils.fromWei(upgradePower, "ether")).toFixed(4)
              : 0;
          userUpgradePower[i].upgradePower = upgradePower;
          levelPrice =
            levelPrice > 0
              ? parseFloat(Web3.utils.fromWei(levelPrice, "ether")).toFixed(4)
              : 0;
          userUpgradePower[i].levelPrice = levelPrice;

          patnerUpgradePower[i].levelPrice = levelPrice;

          partnerUpgradePower =
            partnerUpgradePower > 0
              ? parseFloat(
                  Web3.utils.fromWei(partnerUpgradePower, "ether")
                ).toFixed(4)
              : 0;
          patnerUpgradePower[i].upgradePower = partnerUpgradePower;
        }
        setUserUpgradePower(userUpgradePower);
        setPartnerUpgradePower(partnerUpgradePower);
      }
    };
    userPartnerUpgradeStatus();
  }, [contractInstance, connectedAddress]);

  const handlePayNowClick = async () => {
    const referrerId = document.getElementById("referralIdInput").value;
    const coReferrerId = document.getElementById("coReferralIdInput").value;
    // alert("Values Entered: ", referrerId, coReferrerId);
    console.log("Values Entered: ", referrerId, coReferrerId);
    // event.preventDefault();
    // const loader = document.getElementById("loader-overlay");
    // loader.style.display = "flex";
    try {
      //   const referralId = document.getElementById("referralIdInput").value;
      let userList = await contractInstance.methods
        .userList(referrerId)
        .call({ from: connectedAddress });
      //   let coReferrerId = document.getElementById("coReferralIdInput").value;
      await stableCoinInstance.methods
        .approve(contractAddress, regFee)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          //   loader.style.display = "none";
          alert("Error On apprve:", error);
        })
        .on("receipt", async function (receipt) {
          await contractInstance.methods
            .Registration(referrerId, coReferrerId, regFee)
            .send({ from: connectedAddress, value: 0 })
            .on("error", function (error) {
              console.log("Contract error: ", error);
              //   loader.style.display = "none";
              alert("Error On Registration:", error);
            })
            .on("receipt", async function (receipt) {
              //   loader.style.display = "none";
              alert("Registered Successfully");
            });
        });
    } catch (e) {
      //   console.log("err:e"), (loader.style.display = "none");
      alert("Error in Catch");
    }

    // payNow(referrerId, coReferrerId);
  };

  const [newPartnerAddress, setNewPartnerAddress] = useState("");

  const handleTransferPartnershipClick = async () => {
    // let partnerAddress = document.getElementById("transferPartnershipIn").value;
    //   const loader = document.getElementById("loader-overlay");
    console.log("Calic Handle Transcer: ", newPartnerAddress);
    alert("handleTransferPartnershipClick Called");
    //   loader.style.display = "flex";
    try {
      const payPartnerFee1 = await contractInstance.methods
        .transferPartnership(newPartnerAddress)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          console.log("Contract error: ", error);
          // loader.style.display = "none";
          alert("Error On Registration:", error);
        })
        .on("receipt", async function (receipt) {
          // loader.style.display = "none";
          alert("Upgra Successfully");
        });
    } catch (e) {
      // loader.style.display = "none";
    }
    // transferPartnership(newPartnerAddress);
  };

  const payPartnerFee = async () => {
    let payPartnerFee = await contractInstance.methods
      .partnerFee()
      .call({ from: connectedAddress });
    // const loader = document.getElementById("loader-overlay");
    // loader.style.display = "flex";
    try {
      await stableCoinInstance.methods
        .approve(contractAddress, payPartnerFee)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          console.log("Contract error: ", error);
          //   loader.style.display = "none";
          alert("Error On apprve:", error);
        })
        .on("receipt", async function (receipt) {
          console.log(receipt.contractAddress); // contains the new contract address
          await contractInstance.methods
            .payPartnerFee(payPartnerFee)
            .send({ from: connectedAddress })
            .on("error", function (error) {
              console.log("Contract error: ", error);
              //   loader.style.display = "none";
              alert("Error On PAy Partner Fee:", error);
            })
            .on("receipt", async function (receipt) {
              //   loader.style.display = "none";
              alert("Pay Partner Fee Successfully");
            });
        });
    } catch (e) {
      //   console.log("err:e"), (loader.style.display = "none");
      alert("Error in Catch");
    }
    // Add your pay partner fee logic here
  };

  const [upgradeLevelValue, setUpgradeLevelValue] = useState("");

  const upgradeLevel = async (event) => {
    alert("Upgrade Level Called:");
    try {
      //   let upgradeLevel = document.getElementById("upgradeLevelIn").value;
      const dailyUserTO = await contractInstance.methods
        .UpgradeLevel(upgradeLevelValue)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          console.log("Contract error: ", error);
          //   loader.style.display = "none";
          alert("Error On Registration:", error);
        })
        .on("receipt", async function (receipt) {
          //   loader.style.display = "none";
          alert("Upgra Successfully");
        });
    } catch (e) {
      console.log("Error: ", e);
      //   loader.style.display = "none";
    }
  };

  const [level, setLevel] = useState("0");

  const UpgradePartnerLevel = async () => {
    // let upgradeLevel = document.getElementById("upgradePartnerLevel").value;
    // const loader = document.getElementById("loader-overlay");
    // loader.style.display = "flex";
    try {
      const dailyUserTO = await contractInstance.methods
        .UpgradePartnerLevel(level)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          console.log("Contract error: ", error);
          //   loader.style.display = "none";
          alert("Error On Registration:", error);
        })
        .on("receipt", async function (receipt) {
          //   loader.style.display = "none";
          alert("Upgra Successfully");
        });
    } catch (e) {
      //   loader.style.display = "none";
      console.log("In Catch: ", e);
    }
  };
  return (
    <div className="wrap">
      {/* Dashboard Container */}
      <div className="dashboard min-vh-100">
        {/* Navbar */}
        <nav className="navbar bg-dashboard">
          <div className="container-fluid d-flex justify-content-center">
            <div>
              <a className="navbar-brand" href="#">
                <img
                  src="./logo.png"
                  alt="Logo"
                  width="140"
                  height="24"
                  className="d-inline-block align-text-top"
                />
              </a>
            </div>
          </div>
        </nav>
        {/* Welcome Title */}
        <div className="d-flex justify-content-center input-section">
          <a
            className="mybtn1"
            href="#"
            id="notConnectedButton"
            onClick={() => connectWallet()}
          >
            {isConnected ? <>Connected: {connectedAddress}</> : "Not Connected"}
          </a>
        </div>
        <div className="head-card skew mx-5 mt-4">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="regFee" className="cards-numbers">
                  {regFee
                    ? parseFloat(Web3.utils.fromWei(regFee, "ether")).toFixed(4)
                    : 0}
                </p>
                <p className="cards-title">Registration Fee</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="currentUserId" className="cards-numbers">
                  {currUserID ? Number(currUserID) : 0}
                </p>
                <p className="cards-title">Current User ID</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="totalQualifiedUser" className="cards-numbers">
                  {totalQualifiedUser ? Number(totalQualifiedUser) : 0}
                </p>
                <p className="cards-title">Total Qualified User</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="partnerFee" className="cards-numbers">
                  {partnerFee
                    ? parseFloat(
                        Web3.utils.fromWei(partnerFee, "ether")
                      ).toFixed(4)
                    : 0}
                </p>
                <p className="cards-title">Partner Fee</p>
              </div>
            </div>
          </div>
        </div>

        <div className="head-card skew mx-5 mt-4">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="tokenPrice" className="cards-numbers">
                  {tokenPrice
                    ? parseFloat(
                        Web3.utils.fromWei(tokenPrice, "ether")
                      ).toFixed(4)
                    : 0}{" "}
                  <span className="sub-number">USDT</span>
                </p>
                <p className="cards-title">Token Price</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="partnerCount1" className="cards-numbers">
                  {partnerCount ? Number(partnerCount) : 0}
                </p>
                <p className="cards-title">Partner Count</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="totalReward" className="cards-numbers">
                  {tokenReward
                    ? parseFloat(
                        Web3.utils.fromWei(tokenReward, "ether")
                      ).toFixed(4)
                    : 0}{" "}
                  <span className="sub-number"></span>
                </p>
                <p className="cards-title">Total Reward</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="box">
                <p id="partnerID1" className="cards-numbers">
                  {partnerId ? Number(partnerId) : 0}
                </p>
                <p className="cards-title">Partner ID</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row px-5">
          <div className="col-lg-6">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                USER INFO
              </div>
            </div>
            <div className="user-box">
              <div className="user-item">
                <div className="col-6 user-title">User Id</div>
                <div id="userId" className="col-6 user-value">
                  {userId ? Number(userId) : 0}
                </div>
              </div>
              <div className="user-item">
                <div className="col-6 user-title">ReferrerID</div>
                <div id="referrerID" className="col-6 user-value">
                  {referrerId ? Number(referrerId) : 0}
                </div>
              </div>
              <div className="user-item">
                <div className="col-6 user-title">Coreferrer ID</div>
                <div id="coreferrerID" className="col-6 user-value">
                  {coreferrerID ? Number(coreferrerID) : 0}
                </div>
              </div>
              <div className="user-item">
                <div className="col-6 user-title">Referred Users</div>
                <div id="referredUsers" className="col-6 user-value">
                  {referredUsers ? Number(referredUsers) : 0}
                </div>
              </div>
              <div className="user-item">
                <div className="col-6 user-title">Reg Time</div>
                <div id="regTime" className="col-6 user-value">
                  {regTime
                    ? moment.unix(regTime).format("DD-MM-YYYY")
                    : "00/00/00"}
                </div>
              </div>
              <div className="user-item">
                <div className="col-6 user-title">Income</div>
                <div id="userIncome" className="col-6 user-value">
                  {income
                    ? parseFloat(Web3.utils.fromWei(income, "ether")).toFixed(4)
                    : 0}{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                USER LEVEL INFO
              </div>
            </div>
            <div className="user-box">
              <div className="user-item">
                <div className="col-4 user-title">Level Number</div>
                <div className="col-3 user-value">Team</div>
                <div className="col-3 user-value">Upgraded Count</div>
                <div className="col-2 user-value">Upgrade Status</div>
              </div>
              {userLevelInfo.map(
                ({ level, team, upgradeCount, upgradeStatus }) => (
                  <div className="user-item" key={level}>
                    <div className="col-4 user-title">Level {level}</div>
                    <div className="col-3 user-value">
                      {team ? Number(team) : 0}
                    </div>
                    <div className="col-3 user-value">
                      {upgradeCount ? Number(upgradeCount) : 0}
                    </div>
                    <div
                      className="col-2 user-value"
                      style={{ color: upgradeStatus ? "#28a745" : "#f672a7" }}
                    >
                      {upgradeStatus ? "✓" : "✗"}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="row px-5">
          <div className="col-lg-6 mt-4">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                User Upgrade Power
              </div>
            </div>
            <div className="user-box">
              <div class="user-item">
                <div class="col-4 user-title">Level No</div>
                <div class="col-4 user-value">Upgrade Power</div>
                <div class="col-4 user-value">Level Price</div>
              </div>
              {/* User Upgrade Power Items */}
              {userUpgradePower.map(({ level, upgradePower, levelPrice }) => (
                //   userUpgradePower.map((level) => (
                <div className="user-item" key={level}>
                  <div className="col-4 user-title">Level {level}</div>
                  <div className="col-4 user-value">
                    {upgradePower ? upgradePower : 0}
                  </div>
                  <div className="col-4 user-value ">
                    {levelPrice ? levelPrice : 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6 mt-4">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                AUTO INCOME INFO
              </div>
            </div>
            <div className="user-box">
              {/* Auto Income Info Items */}
              {/* {autoIncomeInfo.map((item) => ( */}
              {autoIncomeInfo.map(({ title, value }) => (
                <div className="user-item" key={title}>
                  <div className="col-6 user-title">{title}</div>
                  <div id={title} className="col-6 user-value">
                    {value ? Number(value) : 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row px-5">
          <div className="col-lg-6 showhideSection">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                PARTNER INFO
              </div>
            </div>
            <div className="user-box">
              {partnerInfo.map(({ title, value }) => (
                <div className="user-item" key={title}>
                  <div className="col-6 user-title">{title}</div>
                  <div id={title} className="col-6 user-value">
                    {value ? Number(value) : 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6 showhideSection">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                PARTNER LEVEL INFO
              </div>
            </div>
            <div className="user-box">
              {/* Partner Level Info Items */}
              {[
                {
                  title: "Level Number",
                  values: ["Team", "Upgraded Count", "Upgrade Status"],
                },
              ].map((item, index) => (
                <div className="user-item" key={index}>
                  <div className="col-4 user-title">{item.title}</div>
                  {item.values.map((value, idx) => (
                    <div className="col-3 user-value" key={idx}>
                      {value}
                    </div>
                  ))}
                </div>
              ))}
              {/* {[1, 2, 3, 4, 5, 6].map((level) => ( */}
              {partnerLevelInfo.map(
                ({ level, team, upgradeCount, upgradeStatus }) => (
                  <div className="user-item" key={level}>
                    <div className="col-4 user-title">Level {level}</div>
                    <div className="col-3 user-value">
                      {team ? Number(team) : 0}
                    </div>
                    <div className="col-3 user-value">
                      {upgradeCount ? Number(upgradeCount) : 0}
                    </div>
                    <div
                      className="col-2 user-value"
                      style={{ color: upgradeStatus ? "#28a745" : "#f672a7" }}
                    >
                      {upgradeStatus ? "✓" : "✗"}
                    </div>

                    {/* <div
                      className="col-2 user-value"
                      style={{ color: "#f672a7" }}
                    >
                      {upgradeStatus}
                    </div> */}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="row px-5">
          <div className="col-lg-6 mt-4 showhideSection">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading text-center rounded-top-2">
                Partner Upgrade Power
              </div>
            </div>
            <div className="user-box">
              <div class="user-item">
                <div class="col-4 user-title">Level No</div>
                <div class="col-4 user-value">Upgrade Power</div>
                <div class="col-4 user-value">Level Price</div>
              </div>
              {/* Partner Upgrade Power Items */}
              {partnerUpgradePower.map(
                ({ level, upgradePower, levelPrice }) => (
                  <div className="user-item" key={level}>
                    <div className="col-4 user-title">Level {level}</div>
                    <div className="col-4 user-value">
                      {upgradePower ? upgradePower : 0}
                    </div>
                    <div className="col-4 user-value levelPrice{level}">
                      {levelPrice ? levelPrice : 0}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div id="hideOnAlreadyReg" className="col-lg-6 mt-4">
            <div className="swap-wrap p-5">
              <div className="swap-head text-center">Registration</div>
              <div className="swap mt-4">
                <div className="swap-box">
                  <div className="node">
                    <p className="node-title">Referrer ID</p>
                    <input
                      className="input-node bg-dashboard form-control ps-2"
                      defaultValue="0"
                      placeholder="Referral Id"
                      type="number"
                      id="referralIdInput"
                    />
                  </div>
                  <div className="node">
                    <p className="node-title">Co Referrer ID</p>
                    <input
                      className="input-node bg-dashboard form-control ps-2"
                      defaultValue="0"
                      placeholder="Co Referral Id"
                      type="number"
                      id="coReferralIdInput"
                    />
                  </div>
                  <div className="pay text-center mt-4">
                    <button className="mybtn1" onClick={handlePayNowClick}>
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {partnerId > 0 && (
            <div id="onlyForPartner1" className="col-lg-6 mt-6">
              <div className="swap-wrap p-5">
                <div className="swap-head text-center">
                  Transfer Partnership
                </div>
                <div className="swap">
                  <div className="swap-box">
                    <div className="node">
                      <p className="node-title">New Partner Address</p>
                      <input
                        id="transferPartnershipIn"
                        className="input-node bg-dashboard form-control ps-2"
                        placeholder="Address"
                        type="text"
                        value={newPartnerAddress}
                        onChange={(e) => setNewPartnerAddress(e.target.value)}
                      />
                    </div>
                    <div className="pay text-center mt-5">
                      <button
                        className="mybtn1"
                        onClick={handleTransferPartnershipClick}
                      >
                        Transfer Partnership
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {examQualifer && (
            <div id="onlyExamQualifier1" className="col-lg-6 mt-4">
              <div className="swap-wrap p-5">
                <div className="swap-head text-center">Pay Partner Fee</div>
                <div className="pay text-center mt-5">
                  <button className="mybtn1" onClick={payPartnerFee}>
                    Pay Partner Fee
                  </button>
                </div>
              </div>
            </div>
          )}
          {partnerId > 0 && (
            <div
              id="upgradeSectionHiding"
              className="col-lg-6 mt-4 hideshowSection"
            >
              <div className="swap-wrap p-5">
                <div className="swap-head text-center">Upgrade Level</div>
                <div className="swap">
                  <div className="swap-box">
                    <div className="node">
                      <p className="node-title">Level</p>
                      <input
                        id="upgradeLevelIn"
                        className="input-node bg-dashboard form-control ps-2"
                        value={upgradeLevelValue}
                        onChange={(e) => setUpgradeLevelValue(e.target.value)}
                        placeholder="round number"
                        type="text"
                      />
                    </div>
                    <div className="pay text-center mt-5">
                      <button className="mybtn1" onClick={upgradeLevel}>
                        Upgrade Level
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {partnerId > 0 && (
            <div id="onlyForPartner" className="col-lg-6 mt-4">
              <div className="swap-wrap p-5">
                <div className="swap-head text-center">
                  Upgrade Partner Level
                </div>
                <div className="swap">
                  <div className="swap-box">
                    <div className="node">
                      <p className="node-title">Level</p>
                      <input
                        id="upgradePartnerLevel"
                        className="input-node bg-dashboard form-control ps-2"
                        placeholder="Level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        type="text"
                      />
                    </div>
                    <div className="pay text-center mt-5">
                      <button className="mybtn1" onClick={UpgradePartnerLevel}>
                        Upgrade Partner Level
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// function connectWallet() {
//   // Add your wallet connection logic here
// }
