from datetime import datetime
import pandas as pd
import io
from dateutil.parser import parse


binanceTypes = {
	"p2p-p2p trading":1,
	"spot-buy":3,
	"spot-fee":3,
	"usdt-futures-fee":1,
	"usdt-futures-funding fee":1,
	"usdt-futures-realize profit and loss":1,
	"spot-sell":3,
	"spot-small assets exchange bnb":2,
	"p2p-p2p trading":1,
	"spot-withdraw":1,
	"spot-deposit":1,
	"spot-distribution":1,
	"isolatedmargin-isolatedmargin loan":1,
	"spot-large otc trading":2,
	"isolatedmargin-isolatedmargin repayment":1,
	"crossmargin-margin repayment":1,
	"crossmargin-margin loan":1,
	"spot-pos savings purchase":1,
	"spot-pos savings interest":1,
	"spot-pos savings redemption":1,
}

allowableMaster = {
  "incoming": [
    'receive',
    'buy',
    'airdrop',
    'staking reward',
    'interest',
    'gift',
    'chain split',
    'mining',
    'income',
    'cashback',
    'realized profit',
    'fiat deposit',
    'borrow',
    'ignore',
    'distribution',
    'isolatedmargin loan',
    'large otc trading',
    'margin loan',
    'p2p trading',
    'pos savings interest',
    'pos savings redemption',
    'deposit',
  ],
  "outgoing": [
    'sell',
    'send',
    'lost/stolen',
    'liquidation',
    'fee',
    'loan fee',
    'loan repayment',
    'personal use',
    'realized loss',
    'fiat withdrawal',
    'mint',
    'funding fee',
    'isolatedmargin repayment',
    'margin repayment',
    'pos savings purchase',
    'realize profit and loss',
    'small assets exchange bnb',
    'withdraw',
  ],
}

def is_date(string, fuzzy=False):
    """
    Return whether the string can be interpreted as a date.

    :param string: str, string to check for date
    :param fuzzy: bool, ignore unknown tokens in string if True
    """
    try: 
        parse(string, fuzzy=fuzzy)
        return True

    except ValueError:
        return False


def isNotNaN(num):
    return num == num

def emptyLineRemoval(line):
    for ch in line:
        if ch != ",":
            return False   
    return True   

def formulaConverter(formula, transaction, previousData):
    if previousData != "":
        return previousData
    
    formulaString = formula
    newStr = formulaString
    operators = ['/','*','+',"-"]
    value = ''
    for index, ch in enumerate(formulaString):
        if ch in operators or index == len(formulaString) - 1:
            try:
                value = value.rstrip()
                value = value.lstrip()
                float(value)
                value = ''
            except:
                if index == len(formulaString) - 1:
                    value += ch
                value = value.rstrip()
                value = value.lstrip()
                if value in transaction.keys():
                    try:
                        newStr = newStr.replace(value,str(abs(float(transaction[value]))))
                    except:
                        return 0
                else:
                    return 0  
                value=''  
        else:
            value += ch                      
    return eval(newStr)  


def csvMapper(transactions:str,rowToCol:bool, exchange:str ,csvSplitIdentifiers:list, csvColumnMapping:dict, csvColumnJoinMapping:list, csvFormulas: dict):
    splittedTransactions = transactions.splitlines()
    for index, line in enumerate(splittedTransactions):
        if emptyLineRemoval(line):
            del splittedTransactions[index]
    

    binanceTransactions = []
    
    if(exchange == 'binance'):
        binanceRelatedTransactions = []
        splittedTransactions = splittedTransactions[1:len(splittedTransactions)]
        for trx in splittedTransactions:
            splitTrx = trx.split(',')    
            binanceRelatedTransactions.append({"User_ID":splitTrx[0], "UTC_Time":splitTrx[1],"Account":splitTrx[2],"Operation":splitTrx[3],"Coin":splitTrx[4],"Change":splitTrx[5]})
        binanceAllTransactions = []
        count = 1
        for index,transaction in enumerate(binanceRelatedTransactions):
            if count == 1:
                count = binanceTypes[(transaction["Account"] + "-" + transaction["Operation"]).lower()]
                relatedTransaction = []
                for i in range(0, count):
                    relatedTransaction.append(binanceRelatedTransactions[index + i])
            
        
                transaction = {}
                for i,trade in enumerate(relatedTransaction):
                    trade["Operation"] = trade["Operation"].lower()
                    splitDate = trade["UTC_Time"].split(" ")
                    stDate = splitDate[0].split("/")
                    stDate[0] = str(int(stDate[0]) + int(stDate[1]))
                    stDate[1] = str(int(stDate[0]) - int(stDate[1]))
                    stDate[0] = str(int(stDate[0]) - int(stDate[1]))
                    trade["UTC_Time"] = "/".join(stDate) + " " + splitDate[1]
                    
                    if float(trade["Change"]) < 0 and  len(relatedTransaction) > 1:
                        if trade["Operation"] == "fee":
                            transaction["fee"] = abs(float(trade["Change"]))
                
                        else:
                            if "symbol" in transaction.keys():
                                if trade["Operation"].lower() in allowableMaster['incoming']:
                                    transaction['symbol'] = transaction['symbol'] + "/" + trade["Coin"] 
                                    transaction['cost'] = abs(float(trade["Change"]))    
                                else:
                                    transaction['symbol'] = trade["Coin"] + "/" + transaction['symbol']
                                    transaction['amount'] = abs(float(trade["Change"]))
                            else:
                                if trade["Operation"].lower() in allowableMaster['incoming']:
                                    transaction['symbol'] =  trade["Coin"] 
                                    transaction['cost'] = abs(float(trade["Change"]))  
                                else:
                                    transaction['symbol'] =  trade["Coin"]
                                    transaction['amount'] = abs(float(trade["Change"]))   
                            transaction['side'] = trade["Operation"]
                            transaction['datetime'] = trade["UTC_Time"]
                    elif  float(trade["Change"]) > 0 and  len(relatedTransaction) > 1:
                        transaction['side'] = trade["Operation"]
                        transaction['datetime'] = trade["UTC_Time"]
                       
                        if "symbol" in transaction.keys():
                            if trade["Operation"].lower() in allowableMaster['incoming']:
                                transaction['symbol'] = trade["Coin"] + "/" + transaction['symbol']
                                transaction['amount'] = abs(float(trade["Change"]))
                            else:
                                transaction['symbol'] =transaction['symbol'] + "/" + trade["Coin"] 
                                transaction['cost'] = abs(float(trade["Change"]))   
                        else:
                            if trade["Operation"].lower() in allowableMaster['incoming']:
                                transaction['symbol'] =  trade["Coin"] 
                                transaction['amount'] = abs(float(trade["Change"]))
                            else:
                                transaction['symbol'] =  trade["Coin"] 
                                transaction['cost'] = abs(float(trade["Change"])) 
                    
                    elif len(relatedTransaction) == 1:      
                        transaction['side'] = trade["Operation"]
                        transaction['datetime'] = trade["UTC_Time"]
                        transaction['cost'] =  abs(float(trade["Change"]))
                        transaction['amount'] = abs(float(trade["Change"]))
                        if "symbol" in transaction.keys():
                            transaction['symbol'] = transaction['symbol'] + "/" + trade["Coin"]  
                        else:
                            transaction['symbol'] = trade["Coin"] 
                print(transaction)                      
                binanceAllTransactions.append(transaction)            
            else:
                count -= 1        
            
        return binanceAllTransactions    
            
            
        
            
        # for key in binanceRelatedTransactions.keys():    
        #     transaction = {
        #         "fee":0,
        #         "cost":0,
        #         "amount": 0,
        #         "symbol": ""
        #     }
        
        #     for trade in binanceRelatedTransactions[key]:
        #         time = trade["UTC_Time"].split(" ")[1]
        #         time = time.split(":")
        #         if len(time) < 3:
        #             trade["UTC_Time"] = trade["UTC_Time"] + ":00"
                
        #         if(float(trade["Change"]) < 0):
        #             if(trade["Operation"] == "Fee"):
        #                 if len(binanceRelatedTransactions[key]) > 1:
        #                     count = 0
        #                     buySellCount = 0
        #                     for txn in binanceRelatedTransactions[key]:
        #                         if txn["Operation"] == "Fee":
        #                             count += 1
        #                         elif txn["Operation"] == "Buy" or txn["Operation"] == "Sell":
        #                             buySellCount += 1   
        #                             # print("Ht")
        #                     if count > 1 and buySellCount == 0:
        #                         # print("Hitting")
        #                         for trade in binanceRelatedTransactions[key]:        
        #                             # print(trade)
        #                             transaction["fee"] = abs(float(trade["Change"]))
        #                             transaction['amount'] = abs(float(trade["Change"]))        
        #                             if "symbol" in transaction.keys():
        #                                 transaction['symbol'] = trade["Coin"] + transaction['symbol'] 
        #                             else:
        #                                 transaction['symbol'] = trade["Coin"]   
        #                             transaction['side'] = trade["Operation"]
        #                             transaction['datetime'] =trade["UTC_Time"] 
        #                             binanceTransactions.append(transaction)
                                    
        #                     else:
        #                         transaction["fee"] = abs(float(trade["Change"]))    
        #                 else:    
        #                     transaction["fee"] = abs(float(trade["Change"]))
        #                     transaction['amount'] = abs(float(trade["Change"]))        
        #                     if "symbol" in transaction.keys():
        #                         transaction['symbol'] = trade["Coin"] + transaction['symbol'] 
        #                     else:
        #                         transaction['symbol'] = trade["Coin"]   
        #                     transaction['side'] = trade["Operation"]
        #                     transaction['datetime'] =trade["UTC_Time"]
                        
        #             else:
        #                 transaction['side'] = trade["Operation"]
        #                 transaction['datetime'] = trade["UTC_Time"]
        #                 transaction['cost'] = abs(float(trade["Change"]))
        #                 if "symbol" in transaction.keys():
        #                     transaction['symbol'] = transaction['symbol'] + "/" + trade["Coin"]  
        #                 else:
        #                     transaction['symbol'] = "/" + trade["Coin"] 
                        
        #         else:
        #             transaction['amount'] = abs(float(trade["Change"]))        
        #             if "symbol" in transaction.keys():
        #                 transaction['symbol'] = trade["Coin"] + transaction['symbol'] 
        #             else:
        #                 transaction['symbol'] = trade["Coin"]   
        #             transaction['side'] = trade["Operation"]
        #             transaction['datetime'] =trade["UTC_Time"]
                        
                
        #         if "amount" in transaction.keys() and "cost" in transaction.keys() and transaction["cost"] != 0:
        #             transaction['price'] = abs(transaction['amount']) / abs(transaction['cost'])
        #         else:
        #             transaction['price'] = 0    
        #         if transaction["symbol"].find("/") == 0:
        #             transaction["symbol"] = transaction["symbol"].replace("/","")
        #     print(transaction)       
        #     binanceTransactions.append(transaction)
        # return binanceTransactions                                                                                      

    data = []
    separatedData = []
    transformedData = []

    if len(csvSplitIdentifiers) > 0 and type(csvSplitIdentifiers) != "str":
        startPoints = []
        endPoints = []
        for csvSI in csvSplitIdentifiers:
            startPoints.append(csvSI['start'])
            endPoints.append(csvSI['end'])
        insertion = False
        for index,line in enumerate(splittedTransactions):
            if "," in line or line != '':
                firstColumn = line.split(",")[0]
                if firstColumn in startPoints and insertion == False:
                    insertion = True 
                elif firstColumn in endPoints and insertion == True:
                    insertion = False
                    separatedData.append(data)
                    data = []
                elif insertion:
                    data.append(line)   

        if(len(separatedData) < 1):
            separatedData.append(data)
    else:
        for line in splittedTransactions:
            data.append(line)          
        separatedData.append(data)   

    for sepData in separatedData:

        data2 = io.StringIO('\n'.join(sepData))
        df = pd.read_csv(data2, sep=",")

        dict = df.to_dict()
        keys = []

        for key in csvColumnMapping.keys():
            keys.append(key)

        lenKey = []
        for key in dict.keys():
            lenKey.append(key)
            break
        
        
        for index in range(len(dict[lenKey[0]])):
            transaction = {}
            trade = {}
            for key in dict.keys():
                trade[key] = dict[key][index]
            for key in keys:
                if key in dict.keys() and type(dict[key][index]) == str and " " in dict[key][index]:
                    if is_date(dict[key][index]):
                        transaction[csvColumnMapping[key]] = dict[key][index]
                        trade[key] = dict[key][index]
                    else:   
                        transaction[csvColumnMapping[key]] = dict[key][index].split(" ")[0]
                        trade[key] = dict[key][index].split(" ")[0]
                elif key in dict.keys():    
                    transaction[csvColumnMapping[key]] = dict[key][index] 
                    trade[key] = dict[key][index] 
            if not csvFormulas is None and csvFormulas != {}:
                for formulaKey in csvFormulas.keys():
                    if csvFormulas[formulaKey] in transaction.keys():
                        res = formulaConverter(formulaKey,trade,transaction[csvFormulas[formulaKey]])       
                        if res != 0:
                            transaction[csvFormulas[formulaKey]] = res      
                    else: 
                        res =  formulaConverter(formulaKey,trade,"")
                        if res != 0: 
                            transaction[csvFormulas[formulaKey]] = res   
                  
                for formulaKey in csvFormulas.keys():
                    if not csvFormulas[formulaKey] in transaction.keys():
                        transaction[csvFormulas[formulaKey]] = 0                              
            for splitColumnObj in csvColumnJoinMapping:
                if dict[splitColumnObj["colLeft"]][index] and dict[splitColumnObj["colRight"]][index] and isNotNaN(dict[splitColumnObj["colLeft"]][index]) and isNotNaN(dict[splitColumnObj["colRight"]][index]):
                    transaction[splitColumnObj["resultCol"]] = dict[splitColumnObj["colLeft"]][index] + splitColumnObj["joinChar"] + dict[splitColumnObj["colRight"]][index]  
                elif  dict[splitColumnObj["colLeft"]][index]:
                    transaction[splitColumnObj["resultCol"]] = dict[splitColumnObj["colLeft"]][index] 
                elif dict[splitColumnObj["colRight"]][index]:      
                    transaction[splitColumnObj["resultCol"]] = dict[splitColumnObj["colRight"]][index] 
                               
            if not "accountAddress" in transaction.keys() or transaction["accountAddress"] == 0 or transaction["accountAddress"] == '0' :
                transaction["accountAddress"] = ""       
            if not "cost" in transaction.keys():
                transaction["cost"] = 0
            elif not isNotNaN(transaction["cost"]):
                transaction["cost"] = 0
            if not "price" in transaction.keys():
                transaction["price"] = 0
            elif not isNotNaN(transaction["price"]):    
                transaction["price"] = 0
            for key in transaction.keys():
                if not isNotNaN(transaction[key]):
                    transaction[key] = "0"             
            transformedData.append(transaction)
    return transformedData
    
