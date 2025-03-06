import { Router } from "express";
import { getUser } from "./getUser";
import { postLogin } from "./postLogin";
import { postRegister } from "./postRegister";
import { getUsers } from "./getUsers";
import { putUser } from "./putUser";
import { deleteUser } from "./deleteUser";
import { putSelfUser } from "./putSelfUser";
import { patchUpdateIsAdmin } from "./patchUpdateIsAdmin";
import { getAccount } from "./getAccount";
import { getAccounts } from "./getAccounts";
import { getCard } from "./getCard";
import { postAccount } from "./postAccount";
import { getTransactions } from "./getTransactions";
import { getOperations } from "./getOperations";
import { patchAccountDailyLimit } from "./patchAccountDailyLimit";
import { getCardByAccountNumber } from "./getCardByAccountNumber";
import { postCard } from "./postCard";
import { postOperation } from "./postOperation";
import { postTransactions } from "./postTransaction";
import { postBuy } from "./postBuy";
import { postDeposit } from "./postDeposit";
import { postWithdraw } from "./postWitdraw";
import { postTransfer } from "./postTransfer";

export function registerRoutes(router: Router): Router {

    getUser(router)
    getCard(router)
    getUsers(router)
    getAccount(router)
    getAccounts(router)
    getTransactions(router)
    getOperations(router)
    getCardByAccountNumber(router)
    postLogin(router)
    postRegister(router)
    postAccount(router)
    postOperation(router)
    postCard(router)
    postTransactions(router)
    postBuy(router)
    postDeposit(router)
    postWithdraw(router)
    postTransfer(router)
    putUser(router)
    putSelfUser(router)
    deleteUser(router)
    patchUpdateIsAdmin(router)
    patchAccountDailyLimit(router)



    return router

}