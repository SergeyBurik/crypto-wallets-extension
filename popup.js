let ethAPIProvider = "https://api.ethplorer.io/"


$("#newWalletBtn").click(() => {
  $("#newWallet").toggle();
});

$(document).ready(() => {
  // show wallets
  console.log("showing wallets...");
  showWalletsAdresses();
});


function showWalletsAdresses() {
    chrome.storage.sync.get("cw_wallets", (wallets) => {
      // get wallets list from storage
      // wallets: "w:t,w:t" - "w" - wallet address, "t" - wallet type
      console.log(wallets.cw_wallets);
      console.log(wallets.cw_wallets.split(","));
      let walletsSplit = wallets.cw_wallets.split(",")
      for (let wallet of walletsSplit) {
        if (wallet == "") {
          continue;
        }
        $(".wallets").append(
          `<div class="wallet">
            <div class="card border-light mb-3" style="max-width: 100%;">
              <div class="card-header"><span id="${wallet.split(":")[0]}" class="walletAddressSpan">${wallet.split(":")[0]}</span></div>
              
              <div id="${wallet.split(":")[0]+"container"}" data-retrieved="0" style="display:none;"></div>
            </div>
          </div>`
        );
      }
    });
}


$(".wallets").on("click", ".walletAddressSpan", (ev)=>{
  // toggle wallet
  $(".wallets").find(`#${ev.target.id+"container"}`).toggle();

  // if wallet data is already retrieved
  if($(".wallets").find(`#${ev.target.id+"container"}`).attr("data-retrieved") == "1") return;

  // retrieve data from api
  $.ajax({
    url:ethAPIProvider + "getAddressInfo/"+ ev.target.id +"?apiKey=freekey",
    success:function(response){
      console.log(response);
      $(".wallets").find(`#${ev.target.id}container`).append(
        `
          <div class="card-body network">
            <h5 class="card-title">ETH network</h5>
            <hr>
          </div>

          <div class="card-body token">
            <h5 class="card-title"><img src="coinImages/eth_logo.svg" alt="eth" class="coinLogo"> $${response.ETH.price.rate.toFixed(2)} <span class="${response.ETH.price.diff < 0 ? 'priceDown' : 'priceUp' }"> (${response.ETH.price.diff}%)</span></h5>
            <p class="card-text">${response.ETH.balance} ETH ($${response.ETH.balance * response.ETH.price.rate.toFixed(2)})</p>
          </div>
        `
      );
      if (response.hasOwnProperty("tokens")) {
        for (let token of response.tokens) {
          $(".wallets").find(`#${ev.target.id}container`).append(
            `
              <div class="card-body token">
                <h5 class="card-title"><img src="${"coinImages/"+token.tokenInfo.symbol+".png"}" alt="${token.tokenInfo.symbol}" class="coinLogo"></h5>
                <p class="card-text">${token.balance} ${token.tokenInfo.symbol} ($${token.balance * response.ETH.price.rate.toFixed(2)})</p>
              </div>
            `
          );
        }
      }

      $(".wallets").find(`#${ev.target.id+"container"}`).attr("data-retrieved", "1");
    }
  });
});


$("#saveNewWalletBtn").click(() => {
  let newWalletAddress = $("#newWalletAddress").val();
  let newCoinSelect = $("#newCoinSelect").val()
  console.log(newWalletAddress, newCoinSelect);

  // save new wallet
  chrome.storage.sync.get("cw_wallets", (wallets) => {
    let newWallet = newWalletAddress+":"+newCoinSelect;

    if (!wallets) {
      chrome.storage.sync.set({"cw_wallets": newWallet + ","}); 
      return; 
    }

    // get wallets list from storage
    // wallets: "w:t,w:t" - "w" - wallet address, "t" - wallet type
    let walletsList = wallets.cw_wallets.split(",");

    if (!walletsList.includes(newWallet)) {
      walletsList.push(newWallet);
      console.log(walletsList);
      // save list as string
      chrome.storage.sync.set({"cw_wallets": walletsList.join(",")});  
    
    }
    // showWallets();
  });
});


function showWallets() {
  // get wallets list from storage 
  let res = ""; // html code
  chrome.storage.sync.get("cw_wallets", (wallets) => {
    console.log(wallets);
    let walletsList = wallets.split(",");

    for (let wallet of walletsList) {
      let w = wallet.split(":");
      if (w[1] == "ETH") { // check wallet type
        res += renderETHWallet(w[0]);
      }
    }
    $(".wallets").html(res);
  });
}

function renderETHWallet(wallet) {
  // find wallet on BlockScan
  // retrieve wallet data from EtherScan, PolygonScan etc...
  return "";
}