import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import moment from "moment";
import {
  contractAddress,
  abi,
  examAddress,
  examABI,
  stableCoinAddress,
  stableCoinABI,
  autoPoolAddress,
  autoPoolABI,
} from "./../utils/contract"; // Import from contract.js

const Dashboard = () => {
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [networkId, setNetworkId] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [examInstance, setExamInstance] = useState(null);
  const [stableCoinInstance, setStableCoinInstance] = useState(null);
  const [autoPoolInstance, setAutoPoolInstance] = useState(null);
  // const [users, setUsers] = useState(null);
  // const [isExamQualifier, setIsExamQualifier] = useState(false);
  const [regFee, setRegFee] = useState(null);

  // User Data
  // const [isUserExist, setIsUserExist] = useState(false);
  const [userId, setUserId] = useState(null);
  const [referrerId, setUserReferrerId] = useState(null);
  const [coreferrerID, setCoreferrerID] = useState(null);
  const [referredUsers, setReferredUsers] = useState(null);
  // const [coreferredUsers, setCoreferredUsers] = useState(0);
  const [income, setIncome] = useState(0);
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

  const [upgradeAllLevelPartnerValue, setUpgradeAllLevelPartnerValue] =
    useState();

  const [userLevelInfo, setUserLevelInfo] = useState([
    { level: 1, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 2, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 3, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 4, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 5, team: 0, upgradeCount: 0, upgradeStatus: false },
    { level: 6, team: 0, upgradeCount: 0, upgradeStatus: false },
  ]);
  const [alluserLevelInfo, setAllUserLevelInfo] = useState([
    { level: 1, team: 0, height: 0, upgradeStatus: false },
    { level: 2, team: 0, height: 0, upgradeStatus: false },
    { level: 3, team: 0, height: 0, upgradeStatus: false },
    { level: 4, team: 0, height: 0, upgradeStatus: false },
    { level: 5, team: 0, height: 0, upgradeStatus: false },
    { level: 6, team: 0, height: 0, upgradeStatus: false },
    { level: 7, team: 0, height: 0, upgradeStatus: false },
  ]);
  const [partnerUpgradePower, setPartnerUpgradePower] = useState([
    { level: 1, upgradePower: 0, levelPrice: 0 },
    { level: 2, upgradePower: 0, levelPrice: 0 },
    { level: 3, upgradePower: 0, levelPrice: 0 },
    { level: 4, upgradePower: 0, levelPrice: 0 },
    { level: 5, upgradePower: 0, levelPrice: 0 },
    { level: 6, upgradePower: 0, levelPrice: 0 },
  ]);
  const [allPartnerUpgradePower, setAllPartnerUpgradePower] = useState([
    { level: 1, upgradePower: 0, levelPrice: 0 },
    { level: 2, upgradePower: 0, levelPrice: 0 },
    { level: 3, upgradePower: 0, levelPrice: 0 },
    { level: 4, upgradePower: 0, levelPrice: 0 },
    { level: 5, upgradePower: 0, levelPrice: 0 },
    { level: 6, upgradePower: 0, levelPrice: 0 },
    { level: 7, upgradePower: 0, levelPrice: 0 },
  ]);
  const [userUpgradePower, setUserUpgradePower] = useState([
    { level: 1, upgradePower: 0, levelPrice: 0 },
    { level: 2, upgradePower: 0, levelPrice: 0 },
    { level: 3, upgradePower: 0, levelPrice: 0 },
    { level: 4, upgradePower: 0, levelPrice: 0 },
    { level: 5, upgradePower: 0, levelPrice: 0 },
    { level: 6, upgradePower: 0, levelPrice: 0 },
  ]);
  const [allUserUpgradePower, setAllUserUpgradePower] = useState([
    { level: 1, upgradePower: 0, levelPrice: 0 },
    { level: 2, upgradePower: 0, levelPrice: 0 },
    { level: 3, upgradePower: 0, levelPrice: 0 },
    { level: 4, upgradePower: 0, levelPrice: 0 },
    { level: 5, upgradePower: 0, levelPrice: 0 },
    { level: 6, upgradePower: 0, levelPrice: 0 },
    { level: 7, upgradePower: 0, levelPrice: 0 },
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
    { level: 7, team: 0, upgradeCount: 0, upgradeStatus: false },
  ]);
  const [allPartnerLevelInfo, setAllPartnerLevelInfo] = useState([
    { level: 1, team: 0, height: 0, upgradeStatus: false },
    { level: 2, team: 0, height: 0, upgradeStatus: false },
    { level: 3, team: 0, height: 0, upgradeStatus: false },
    { level: 4, team: 0, height: 0, upgradeStatus: false },
    { level: 5, team: 0, height: 0, upgradeStatus: false },
    { level: 6, team: 0, height: 0, upgradeStatus: false },
    { level: 7, team: 0, height: 0, upgradeStatus: false },
  ]);

  const [searchHeightUser, setSearchHeightUser] = useState(""); // New state for search input
  const [searchHeightPartner, setSearchHeightPartner] = useState(""); // New state for search input
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    let storedAddress = localStorage.getItem("connectedAddress");
    if (storedAddress) {
      storedAddress = "0xb8D4217B314192857a2Ba34F413008F4EAdfd0f0";
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
        account = "0xb8D4217B314192857a2Ba34F413008F4EAdfd0f0";
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
      // const chainId = await window.ethereum.request({ method: "eth_chainId" });
      // setNetworkId(chainId);
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
        const autoPoolInstance = new web3.eth.Contract(
          autoPoolABI,
          autoPoolAddress
        );
        setContractInstance(contractInstance);
        setExamInstance(examInstance);
        setStableCoinInstance(stableInstance);
        setAutoPoolInstance(autoPoolInstance);
        // const usersData = await contractInstance.methods
        //   .users(connectedAddress)
        //   .call({ from: connectedAddress });
        // setUsers(usersData);

        // const isExamPassed = await examInstance.methods
        //   .isPass(connectedAddress)
        //   .call({ from: connectedAddress });
        // setIsExamQualifier(isExamPassed);
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
        let pool1users = await autoPoolInstance.methods
          .pool1users(connectedAddress)
          .call({ from: connectedAddress });

        setUserId(usersData.id);
        setUserReferrerId(usersData.referrerID);
        setCoreferrerID(usersData.coreferrerID);
        setReferredUsers(usersData.referredUsers);
        setIncome(usersData.income + pool1users.autoIncome);
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
            .userUpgradeCount(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          fetchedData[i].upgradeCount = upgradeCount;
        }
        console.log("Fetch data of user levek info: ", fetchedData);
        setUserLevelInfo(fetchedData);
      }
    };
    userLevelInfoCall();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const allUserLevelInfoCall = async () => {
      if (contractInstance && connectedAddress) {
        const fetchedData = [
          { level: 1, team: 0, height: 0, upgradeStatus: false },
          { level: 2, team: 0, height: 0, upgradeStatus: false },
          { level: 3, team: 0, height: 0, upgradeStatus: false },
          { level: 4, team: 0, height: 0, upgradeStatus: false },
          { level: 5, team: 0, height: 0, upgradeStatus: false },
          { level: 6, team: 0, height: 0, upgradeStatus: false },
          { level: 7, team: 0, height: 0, upgradeStatus: false },
        ];

        let levels = await contractInstance.methods
          .levels(connectedAddress)
          .call({ from: connectedAddress });

        for (let i = 0; i < 7; i++) {
          let userUpgradeStatus = await contractInstance.methods
            .alluserUpgradeStatus(i + 1, connectedAddress)
            .call({ from: connectedAddress });

          fetchedData[i].upgradeStatus = userUpgradeStatus;
          fetchedData[i].team = levels[i];
          let height = await contractInstance.methods
            .allHeightLevel(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          fetchedData[i].height = height;
        }
        setAllUserLevelInfo(fetchedData);
      }
    };
    allUserLevelInfoCall();
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
          { level: 7, team: 0, upgradeCount: 0, upgradeStatus: false },
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
          fetchedData[i].upgradeStatus = partnerUpgradeStatus ? true : false;
          fetchedData[i].team = parLevels[i];
          fetchedData[i].upgradeCount = partnerUpgradeCount;
        }
        setPartnerLevelInfo(fetchedData);
      }
    };
    partnerLevelInfo();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const allPartnerLevelInfo = async () => {
      if (contractInstance && connectedAddress) {
        let parLevels = await contractInstance.methods
          .parLevels(connectedAddress)
          .call({ from: connectedAddress });
        const fetchedData = [
          {
            level: 1,
            team: parLevels[0],
            height: 0,
            upgradeStatus: false,
          },
          {
            level: 2,
            team: parLevels[1],
            height: 0,
            upgradeStatus: false,
          },
          {
            level: 3,
            team: parLevels[2],
            height: 0,
            upgradeStatus: false,
          },
          {
            level: 4,
            team: parLevels[3],
            height: 0,
            upgradeStatus: false,
          },
          {
            level: 5,
            team: parLevels[4],
            height: 0,
            upgradeStatus: false,
          },
          {
            level: 6,
            team: parLevels[5],
            height: 0,
            upgradeStatus: false,
          },
          {
            level: 7,
            team: parLevels[6],
            height: 0,
            upgradeStatus: false,
          },
        ];

        for (let i = 0; i < 7; i++) {
          let partnerUpgradeStatus = await contractInstance.methods
            .allpartnerUpgradeStatus(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          let partnerUpgradeCount = await contractInstance.methods
            .allPartnerHeightLevel(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          fetchedData[i].upgradeStatus = partnerUpgradeStatus;
          fetchedData[i].height = partnerUpgradeCount;
        }
        console.log("Fetch Data: ", fetchedData);
        setAllPartnerLevelInfo(fetchedData);
      }
    };
    allPartnerLevelInfo();
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

        let pool1activeUserID = await autoPoolInstance.methods
          .pool1activeUserID()
          .call({ from: connectedAddress });
        let pool1currUserID = await autoPoolInstance.methods
          .pool1currUserID()
          .call({ from: connectedAddress });
        let pool1users = await autoPoolInstance.methods
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
        let pool1users = await autoPoolInstance.methods
          .pool1users(connectedAddress)
          .call({ from: connectedAddress });
        partnerInfo[0].value = partnerCount;
        partnerInfo[1].value = partnerId;
        let income1 = income.income + pool1users.autoIncome;
        partnerInfo[2].value =
          income1 > 0
            ? parseFloat(Web3.utils.fromWei(income1, "ether")).toFixed(4)
            : 0;
        partnerInfo[3].value = income.planer;
        partnerInfo[4].value = income.levelIncomeReceived;
        setPartnerInfo(partnerInfo);
      }
    };

    partnerInfo();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const userPartnerUpgradeStatus = async () => {
      if (contractInstance && connectedAddress) {
        const patnerUpgradePower1 = [
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
            .userUpgradePower(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          let levelPrice = await contractInstance.methods
            .LEVEL_PRICE(i + 1)
            .call({ from: connectedAddress });
          let partnerUpgradePower = await contractInstance.methods
            .partnerUpgradePower(i + 1, connectedAddress)
            .call({ from: connectedAddress });

          upgradePower =
            Number(upgradePower) > 0
              ? parseFloat(Web3.utils.fromWei(upgradePower, "ether")).toFixed(4)
              : 0;
          userUpgradePower[i].upgradePower = upgradePower;
          levelPrice =
            levelPrice > 0
              ? parseFloat(Web3.utils.fromWei(levelPrice, "ether")).toFixed(4)
              : 0;
          userUpgradePower[i].levelPrice = levelPrice;

          patnerUpgradePower1[i].levelPrice = levelPrice;

          let partnerUpgradePower2 =
            Number(partnerUpgradePower) > 0
              ? parseFloat(
                  Web3.utils.fromWei(partnerUpgradePower, "ether")
                ).toFixed(4)
              : 0;
          // console.log("Upgrade Power : ", i, partnerUpgradePower2);

          patnerUpgradePower1[i].upgradePower = Number(partnerUpgradePower2);
        }
        setUserUpgradePower(userUpgradePower);
        setPartnerUpgradePower(patnerUpgradePower1);
      }
    };
    userPartnerUpgradeStatus();
  }, [contractInstance, connectedAddress]);

  useEffect(() => {
    const allUserPartnerUpgradeStatus = async () => {
      if (contractInstance && connectedAddress) {
        const patnerUpgradePower = [
          { level: 1, upgradePower: 0, levelPrice: 28 },
          { level: 2, upgradePower: 0, levelPrice: 56 },
          { level: 3, upgradePower: 0, levelPrice: 112 },
          { level: 4, upgradePower: 0, levelPrice: 224 },
          { level: 5, upgradePower: 0, levelPrice: 448 },
          { level: 6, upgradePower: 0, levelPrice: 896 },
          { level: 7, upgradePower: 0, levelPrice: 1792 },
          { level: 8, upgradePower: 0, levelPrice: 3584 },
          { level: 9, upgradePower: 0, levelPrice: 7168 },
          
        ];
        const userUpgradePower = [
          { level: 1, upgradePower: 0, levelPrice: 28 },
          { level: 2, upgradePower: 0, levelPrice: 56 },
          { level: 3, upgradePower: 0, levelPrice: 112 },
          { level: 4, upgradePower: 0, levelPrice: 224 },
          { level: 5, upgradePower: 0, levelPrice: 448 },
          { level: 6, upgradePower: 0, levelPrice: 896 },
          { level: 7, upgradePower: 0, levelPrice: 1792 },
          { level: 8, upgradePower: 0, levelPrice: 3584 },
          { level: 9, upgradePower: 0, levelPrice: 7168 },
        ];

        for (let i = 0; i < 7; i++) {
          let allUserUpgradePower = await contractInstance.methods
            .allUserUpgradePower(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          let partnerUpgradePower = await contractInstance.methods
            .allPartnerUpgradePower(i + 1, connectedAddress)
            .call({ from: connectedAddress });
          allUserUpgradePower =
            allUserUpgradePower > 0
              ? parseFloat(
                  Web3.utils.fromWei(allUserUpgradePower, "ether")
                ).toFixed(4)
              : 0;
          userUpgradePower[i].upgradePower = allUserUpgradePower;
          partnerUpgradePower =
            partnerUpgradePower > 0
              ? parseFloat(
                  Web3.utils.fromWei(partnerUpgradePower, "ether")
                ).toFixed(4)
              : 0;
          patnerUpgradePower[i].upgradePower = partnerUpgradePower;
        }
        setAllUserUpgradePower(userUpgradePower);
        setAllPartnerUpgradePower(patnerUpgradePower);
      }
    };
    allUserPartnerUpgradeStatus();
  }, [contractInstance, connectedAddress]);

  const handlePayNowClick = async () => {
    const referrerId = document.getElementById("referralIdInput").value;
    const coReferrerId = document.getElementById("coReferralIdInput").value;
    let identityIs = "Asd12F";

    try {
      setLoading(true);
      let taxRate = await contractInstance.methods.taxRate().call();
      let regisFee;
      if (Number(taxRate) > 0) {
        let tax = (regFee * taxRate) / 100n;
        regisFee = regFee + tax;
      } else {
        regisFee = regFee;
      }

      await stableCoinInstance.methods
        .approve(contractAddress, regisFee)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          setLoading(false);
          //   loader.style.display = "none";
          alert("Error On apprve:", error);
        })
        .on("receipt", async function (receipt) {
          setLoading(false);
          await contractInstance.methods
            .Registration(referrerId, coReferrerId, regisFee, identityIs)
            .send({ from: connectedAddress, value: 0 })
            .on("error", function (error) {
              setLoading(false);
              //   loader.style.display = "none";
              alert("Error On Registration:", error);
            })
            .on("receipt", async function (receipt) {
              //   loader.style.display = "none";
              setLoading(false);
              alert("Registered Successfully");
            });
        });
    } catch (e) {
      setLoading(false);
      alert("Error in Catch");
    }
  };

  const handleBuyAutoPool = async () => {
    try {
      setLoading(true);
      let autoPoolFee = await autoPoolInstance.methods.pool1_price().call();
      let taxRate = await contractInstance.methods.taxRate().call();
      let regisFee;
      if (Number(taxRate) > 0) {
        let tax = (autoPoolFee * taxRate) / 100n;
        regisFee = autoPoolFee + tax;
      } else {
        regisFee = autoPoolFee;
      }

      await stableCoinInstance.methods
        .approve(autoPoolAddress, regisFee)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          setLoading(false);
          //   loader.style.display = "none";
          alert("Error On apprve:", error);
        })
        .on("receipt", async function (receipt) {
          setLoading(false);
          await autoPoolInstance.methods
            .Registration(regisFee)
            .send({ from: connectedAddress, value: 0 })
            .on("error", function (error) {
              setLoading(false);
              //   loader.style.display = "none";
              alert("Error On Buy AutoPool:", error);
            })
            .on("receipt", async function (receipt) {
              //   loader.style.display = "none";
              setLoading(false);
              alert("Registered Buy AutoPool");
            });
        });
    } catch (e) {
      setLoading(false);
      alert("Error in Catch");
    }
  };

  const [newPartnerAddress, setNewPartnerAddress] = useState("");

  const handleTransferPartnershipClick = async () => {
    try {
      const payPartnerFee1 = await contractInstance.methods
        .transferPartnership(newPartnerAddress)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          alert("Error On Registration:", error);
        })
        .on("receipt", async function (receipt) {
          alert("Upgra Successfully");
        });
    } catch (e) {}
  };

  const payPartnerFee = async () => {
    setLoading(true);
    let payPartnerFee = await contractInstance.methods
      .partnerFee()
      .call({ from: connectedAddress });
    try {
      await stableCoinInstance.methods
        .approve(contractAddress, payPartnerFee)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          setLoading(false);
          alert("Error On apprve:", error);
        })
        .on("receipt", async function (receipt) {
          setLoading(false);
          await contractInstance.methods
            .payPartnerFee(payPartnerFee)
            .send({ from: connectedAddress })
            .on("error", function (error) {
              setLoading(false);
              alert("Error On PAy Partner Fee:", error);
            })
            .on("receipt", async function (receipt) {
              setLoading(false);
              alert("Pay Partner Fee Successfully");
            });
        });
    } catch (e) {
      setLoading(false);
      alert("Error in Catch");
    }
  };

  const [upgradeLevelValue, setUpgradeLevelValue] = useState("");
  const [upgradeAllLevelUserValue, setUpgradeAllLevelUserValue] = useState("");

  const upgradeLevel = async (event) => {
    try {
      console.log("Upgrade level called");
      await contractInstance.methods
        .UpgradeUserLevel(upgradeLevelValue)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          alert("Error On UpgradeLevel:", error);
        })
        .on("receipt", async function (receipt) {
          alert("UpgradeLevel Successfully");
        });
    } catch (e) {
      console.log("Error: ", e);
    }
  };
  const handleUpgradeAllLevelPartner = async (event) => {
    try {
      setLoading(true); // Show the loader
      let appAmount;
      if (Number(upgradeAllLevelUserValue) == 1) {
        appAmount = await contractInstance.methods
          .ALL_LEVEL_PRICE(upgradeAllLevelUserValue)
          .call();
        let taxRate = await contractInstance.methods.taxRate().call();
        if (Number(taxRate) > 0) {
          let tax = (appAmount * taxRate) / 100n;
          appAmount = appAmount + tax;
        }
        appAmount = appAmount * 2n;
        await stableCoinInstance.methods
          .approve(contractAddress, appAmount)
          .send({ from: connectedAddress })
          .on("error", function (error) {
            setLoading(false); // Show the loader
            alert("Error On UpgradeAllLevelPartner:", error);
          })
          .on("receipt", async function (receipt) {
            setLoading(false); // Show the loader
            await contractInstance.methods
              .UpgradeAllLevelOne(upgradeAllLevelUserValue)
              .send({ from: connectedAddress })
              .on("error", function (error) {
                setLoading(false); // Show the loader
                alert("Error On UpgradeAllLevelPartner:", error);
              })
              .on("receipt", async function (receipt) {
                setLoading(false); // Show the loader
                alert("UpgradeAllLevelPartner Successfully");
              });
          });
      } else {
        appAmount = await contractInstance.methods
          .ALL_LEVEL_PRICE(upgradeAllLevelUserValue)
          .call();
        await stableCoinInstance.methods
          .approve(contractAddress, appAmount)
          .send({ from: connectedAddress })
          .on("error", function (error) {
            setLoading(false); // Show the loader
            alert("Error On UpgradeAllLevelUser:", error);
          })
          .on("receipt", async function (receipt) {
            setLoading(false); // Show the loader
            await contractInstance.methods
              .UpgradeAllLevelPartner(upgradeAllLevelPartnerValue)
              .send({ from: connectedAddress })
              .on("error", function (error) {
                setLoading(false); // Show the loader
                alert("Error On UpgradeAllLevelPartner:", error);
              })
              .on("receipt", async function (receipt) {
                //   loader.style.display = "none";
                setLoading(false); // Show the loader

                alert("UpgradeAllLevelPartner Successfully");
              });
          });
      }
    } catch (e) {
      setLoading(false); // Show the loader
      console.log("Error: ", e);
      //   loader.style.display = "none";
    }
  };

  const handleSearchHeightUser = async () => {
    if (contractInstance && connectedAddress) {
      const fetchedData = alluserLevelInfo.map((info) => ({ ...info }));
      let height = await contractInstance.methods
        .allHeightLevel(searchHeightUser, connectedAddress)
        .call({ from: connectedAddress });
      for (let i = 0; i < 7; i++) {
        fetchedData[i].height = Number(height[i]);
      }
      setAllUserLevelInfo(fetchedData);
    }
  };
  const handleSearchHeightPartner = async () => {
    if (contractInstance && connectedAddress) {
      const fetchedData = allPartnerLevelInfo.map((info) => ({ ...info }));
      let height = await contractInstance.methods
        .allPartnerHeightLevel(searchHeightPartner, connectedAddress)
        .call({ from: connectedAddress });
      for (let i = 0; i < 7; i++) {
        fetchedData[i].height = Number(height[i]);
      }
      setAllPartnerLevelInfo(fetchedData);
    }
  };

  const handleUpgradeAllLevelUser = async (event) => {
    try {
      setLoading(true); // Show the loader
      let appAmount;
      //  = await contractInstance.methods
      //   .ALL_LEVEL_PRICE(upgradeAllLevelUserValue)
      //   .call();
      // await stableCoinInstance.methods
      //   .approve(contractAddress, appAmount)
      //   .send({ from: connectedAddress })
      //   .on("error", function (error) {
      //     setLoading(false); // Show the loader
      //     alert("Error On UpgradeAllLevelUser:", error);
      //   })
      //   .on("receipt", async function (receipt) {
      //     setLoading(false); // Show the loader
      if (Number(upgradeAllLevelUserValue) == 1) {
        appAmount = await contractInstance.methods
          .ALL_LEVEL_PRICE(upgradeAllLevelUserValue)
          .call();
        let taxRate = await contractInstance.methods.taxRate().call();
        if (Number(taxRate) > 0) {
          let tax = (appAmount * taxRate) / 100n;
          appAmount = appAmount + tax;
        }
        appAmount = appAmount * 2n;
        await stableCoinInstance.methods
          .approve(contractAddress, appAmount)
          .send({ from: connectedAddress })
          .on("error", function (error) {
            setLoading(false); // Show the loader
            alert("Error On UpgradeAllLevelUser:", error);
          })
          .on("receipt", async function (receipt) {
            setLoading(false); // Show the loader
            await contractInstance.methods
              .UpgradeAllLevelOne(upgradeAllLevelUserValue)
              .send({ from: connectedAddress })
              .on("error", function (error) {
                setLoading(false); // Show the loader
                alert("Error On UpgradeAllLevelUser:", error);
              })
              .on("receipt", async function (receipt) {
                setLoading(false); // Show the loader
                alert("UpgradeAllLevelUser Successfully");
              });
          });
      } else {
        appAmount = await contractInstance.methods
          .ALL_LEVEL_PRICE(upgradeAllLevelUserValue)
          .call();
        await stableCoinInstance.methods
          .approve(contractAddress, appAmount)
          .send({ from: connectedAddress })
          .on("error", function (error) {
            setLoading(false); // Show the loader
            alert("Error On UpgradeAllLevelUser:", error);
          })
          .on("receipt", async function (receipt) {
            setLoading(false); // Show the loader
            await contractInstance.methods
              .UpgradeAllLevelUser(upgradeAllLevelUserValue)
              .send({ from: connectedAddress })
              .on("error", function (error) {
                setLoading(false);
                alert("Error On UpgradeAllLevelUser:", error);
              })
              .on("receipt", async function (receipt) {
                setLoading(false);
                alert("UpgradeAllLevelUser Successfully");
              });
          });
      }
    } catch (e) {
      console.log("Error: ", e);
      setLoading(false);
      //   loader.style.display = "none";
    }
  };

  const [level, setLevel] = useState("0");

  const UpgradePartnerLevel = async () => {
    try {
      const dailyUserTO = await contractInstance.methods
        .UpgradePartnerLevel(level)
        .send({ from: connectedAddress })
        .on("error", function (error) {
          setLoading(false);
          alert("Error On Registration:", error);
        })
        .on("receipt", async function (receipt) {
          //   loader.style.display = "none";
          setLoading(false);
          alert("Upgra Successfully");
        });
    } catch (e) {
      //   loader.style.display = "none";
      console.log("In Catch: ", e);
      setLoading(false);
    }
  };
  return (
    <div className="wrap">
      {/* Loader */}
      {/* <div> */}
      {loading && (
        <div className="loader-wrapper" ref={loaderRef}>
          <div className="loader"></div>
          <h2>Transaction Confirming</h2>
        </div>
      )}
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
                  height="55"
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
              <div className="network-heading network-heading-updated1 text-center rounded-top-2">
                AUTO INCOME INFO
              </div>
            </div>
            <div className="user-box custom-background1">
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
              {/* {console.log("Partner Upgrade in HTML: ", partnerUpgradePower)} */}
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
          {Number(userId) == 0 && (
            <div className="col-lg-6 mt-4">
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
          )}
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
          {partnerId > 0 && (
            <div className="col-lg-6 mt-4">
              <div className="swap-wrap  p-5">
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
        <div className="row px-5">
          <div className="col-lg-6 ">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading-updated text-center rounded-top-2 ">
                All USER LEVEL INFO
              </div>
            </div>

            <div className="user-box custom-background">
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  value={searchHeightUser}
                  onChange={(e) => setSearchHeightUser(e.target.value)}
                  placeholder="Search by height"
                  className="form-control col-4"
                />
                <button
                  onClick={handleSearchHeightUser}
                  className="btn btn-primary ml-2"
                >
                  Search
                </button>
              </div>
              <div className="user-item mt-4">
                <div className="col-3 user-title">Level Number</div>
                <div className="col-3 user-value">Team</div>
                <div className="col-3 user-value">Height</div>
                <div className="col-3 user-value">Upgrade Status</div>
              </div>

              {alluserLevelInfo.map(
                ({ level, team, height, upgradeStatus }) => (
                  <div className="user-item" key={level}>
                    <div className="col-3 user-title">Level {level}</div>
                    <div className="col-3 user-value">
                      {team ? Number(team) : 0}
                    </div>
                    <div className="col-3 user-value">
                      {Number(height) ? Number(height) : 0}
                    </div>
                    <div
                      className="col-3 user-value"
                      style={{ color: upgradeStatus ? "#28a745" : "#f672a7" }}
                    >
                      {upgradeStatus ? "✓" : "✗"}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="col-lg-6 ">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading-updated text-center rounded-top-2">
                All User Upgrade Power
              </div>
            </div>
            <div className="user-box custom-background">
              <div class="user-item">
                <div class="col-4 user-title">Level No</div>
                <div class="col-4 user-value">Upgrade Power</div>
                <div class="col-4 user-value">Level Price</div>
              </div>
              {/* User Upgrade Power Items */}
              {allUserUpgradePower.map(
                ({ level, upgradePower, levelPrice }) => (
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
                )
              )}
            </div>
          </div>
        </div>

        <div className="row px-5">
          <div className="col-lg-6 showhideSection">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading-updated text-center rounded-top-2">
                All PARTNER LEVEL INFO
              </div>
            </div>
            <div className="user-box custom-background">
              <div className="d-flex justify-content-center">
                <input
                  type="text"
                  value={searchHeightPartner}
                  onChange={(e) => setSearchHeightPartner(e.target.value)}
                  placeholder="Search by height"
                  className="form-control col-4"
                />
                <button
                  onClick={handleSearchHeightPartner}
                  className="btn btn-primary ml-2"
                >
                  Search
                </button>
              </div>
              {[
                {
                  title: "Level Number",
                  values: ["Team", "Height", "Upgrade Status"],
                },
              ].map((item, index) => (
                <div className="user-item mt-4" key={index}>
                  <div className="col-3 user-title">{item.title}</div>
                  {item.values.map((value, idx) => (
                    <div className="col-3 user-value" key={idx}>
                      {value}
                    </div>
                  ))}
                </div>
              ))}
              {/* {[1, 2, 3, 4, 5, 6].map((level) => ( */}
              {allPartnerLevelInfo.map(
                ({ level, team, height, upgradeStatus }) => (
                  <div className="user-item" key={level}>
                    <div className="col-3 user-title">Level {level}</div>
                    <div className="col-3 user-value">
                      {team ? Number(team) : 0}
                    </div>
                    <div className="col-3 user-value">
                      {Number(height) ? Number(height) : 0}
                    </div>
                    <div
                      className="col-3 user-value"
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
          <div className="col-lg-6  showhideSection">
            <div className="d-flex justify-content-center mt-4">
              <div className="network-heading-updated text-center rounded-top-2">
                All Partner Upgrade Power
              </div>
            </div>
            <div className="user-box custom-background">
              <div class="user-item">
                <div class="col-4 user-title">Level No</div>
                <div class="col-4 user-value">Upgrade Power</div>
                <div class="col-4 user-value">Level Price</div>
              </div>
              {/* Partner Upgrade Power Items */}

              {allPartnerUpgradePower.map(
                ({ level, upgradePower, levelPrice }) => (
                  <div className="user-item" key={level}>
                    <div className="col-4 user-title">Level {level}</div>
                    <div className="col-4 user-value">
                      {upgradePower ? upgradePower : 0}
                    </div>
                    <div className="col-4 user-value levelPrice{level}">
                      {Number(levelPrice) ? Number(levelPrice) : 0}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="row px-5">
          <div className="col-lg-6 mt-4 ">
            <div className="swap-wrap  custom-background p-5">
              <div className="swap-head text-center">
                Upgrade All Level User
              </div>
              <div className="swap">
                <div className="swap-box">
                  <div className="node">
                    <p className="node-title">Level</p>
                    <input
                      className="input-node bg-dashboard form-control ps-2"
                      value={upgradeAllLevelUserValue}
                      onChange={(e) =>
                        setUpgradeAllLevelUserValue(e.target.value)
                      }
                      placeholder="Level No"
                      type="text"
                    />
                  </div>
                  <div className="pay text-center mt-5">
                    <button
                      className="mybtn1"
                      onClick={handleUpgradeAllLevelUser}
                    >
                      Upgrade Level
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {partnerId > 0 && (
            <div className="col-lg-6 mt-4 ">
              <div className="swap-wrap custom-background p-5">
                <div className="swap-head text-center">
                  Upgrade All Level Partner
                </div>
                <div className="swap">
                  <div className="swap-box">
                    <div className="node">
                      <p className="node-title">Level</p>
                      <input
                        className="input-node bg-dashboard form-control ps-2"
                        value={upgradeAllLevelPartnerValue}
                        onChange={(e) =>
                          setUpgradeAllLevelPartnerValue(e.target.value)
                        }
                        placeholder="Level No"
                        type="text"
                      />
                    </div>
                    <div className="pay text-center mt-5">
                      <button
                        className="mybtn1"
                        onClick={handleUpgradeAllLevelPartner}
                      >
                        Upgrade Level
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {Number(autoIncomeInfo[2].value) == 0 && (
            <div className="col-lg-6 mt-4">
              <div className="swap-wrap p-5">
                <div className="swap-head text-center">Buy AutoPool</div>
                <div className="pay text-center mt-4">
                  <button className="mybtn1" onClick={handleBuyAutoPool}>
                    Buy AutoPool
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* {Number(userId) == 0 && ( */}

        {/* )} */}
      </div>
    </div>
  );
};

export default Dashboard;

// function connectWallet() {
//   // Add your wallet connection logic here
// }
