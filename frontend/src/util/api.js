import axios from 'axios';

export const auth = {
  endpoint: process.env.REACT_APP_API, // 'http://localhost:5000/api', //Dev

  async login(username, password) {
    try {
      const response = await axios.post(
        `${this.endpoint}/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      const { data, status } = response;
      return { data, status };
    } catch (error) {
      const { data, status } = error.response;
      return { data, status };
    }
  },

  async signup(username, password) {
    try {
      const response = await axios.post(
        `${this.endpoint}/signup`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      const { data, status } = response;
      return { data, status };
    } catch (error) {
      const { data, status } = error.response;
      return { data, status };
    }
  },

  isAuth() {
    return axios.get(`${this.endpoint}/is-auth`, { withCredentials: true });
  },

  logout() {
    return axios.get(`${this.endpoint}/logout`, { withCredentials: true });
  },
};

export const groups = {
  endpoint: process.env.REACT_APP_API, // 'http://localhost:5000/api', //Dev

  /*

    try {
      const response = await axios.post(
        `${this.endpoint}/signup`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      const { data, status } = response;
      return { data, status };
    } catch (error) {
      const { data, status } = error.response;
      return { data, status };
    }

*/
  create(groupName, description, date) {
    // User must be logged in
    return axios.post(
      `${this.endpoint}/groups`,
      {
        groupName,
        description,
        date,
      },
      { withCredentials: true }
    );
  },
  createNewGroup(infoNewGroup) {
    // User must be logged in
    return axios.post(`${this.endpoint}/groups`, infoNewGroup, {
      withCredentials: true,
    });
  },

  async getAll() {
    try {
      const response = await axios.get(
        // User must be logged in
        `${this.endpoint}/groups`,
        { withCredentials: true }
      );
      const { data, status } = response;
      return { data, status };
    } catch (error) {
      const { data, status } = error.response;
      return { data, status };
    }
  },

  async getOne(groupId) {
    try {
      const response = await axios.get(
        // User must be logged in
        `${this.endpoint}/groups/${groupId}`,
        { withCredentials: true }
      );
      const { data, status } = response;
      return { data, status };
    } catch (error) {
      const { data, status } = error.response;
      return { data, status };
    }
  },

  async put(groupId, groupDataObj) {
    try {
      const response = await axios.put(
        // User must be logged in
        `${this.endpoint}/groups/${groupId}`,
        groupDataObj, // Verificar modo de passar dados do grupo que serão modificados
        { withCredentials: true }
      );
      const { data, status } = response;
      return { data, status };
    } catch (error) {
      const { data, status } = error.response;
      return { data, status };
    }
  },

  delete(groupId) {
    return axios.delete(
      // User must be logged in
      `${this.endpoint}/groups/${groupId}`,
      { withCredentials: true }
    );
  },

  //EXPENSES
  /*Example:

      expenseData: {
       "description": "picanha",
        "value": 10,
        "split": {
          "paidBy": "WonderWoman",
          "dividedBy": ["WonderWoman","Batman", "Aquaman", "Superman"]
        }
      }
    
      */
  createExpense(groupID, expenseDataObj) {
    // User must be logged in
    return axios.post(
      `${this.endpoint}/groups/${groupID}/expenses`,
      expenseDataObj,
      { withCredentials: true }
    );
  },

  putExpense(groupID, expenseID, expenseDataObj) {
    // User must be logged in
    return axios.put(
      `${this.endpoint}/groups/${groupID}/expenses/${expenseID}`,
      expenseDataObj,
      { withCredentials: true }
    );
  },

  deleteExpense(groupID, expenseID) {
    // User must be logged in
    return axios.delete(
      `${this.endpoint}/groups/${groupID}/expenses/${expenseID}`,
      { withCredentials: true }
    );
  },

  //SETTLES
  /*Model:
      {
        owner: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
        value: { type: Number, required: true },
        paidBy: String,
        paidTo: String,
      },

      Example: settleDataObj / JSON


      {
        "value": 40,
        "paidBy": "Superman",
        "paidTo": "WonderWoman"
      }
    
      */
  createSettle(groupID, settleDataObj) {
    // User must be logged in
    return axios.post(
      `${this.endpoint}/groups/${groupID}/settles`,
      settleDataObj,
      { withCredentials: true }
    );
  },

  putSettle(groupID, settleID, settleDataObj) {
    // User must be logged in
    return axios.put(
      `${this.endpoint}/groups/${groupID}/settles/${settleID}`,
      settleDataObj,
      { withCredentials: true }
    );
  },

  deleteSettle(groupID, settleID) {
    // User must be logged in
    return axios.delete(
      `${this.endpoint}/groups/${groupID}/settles/${settleID}`,
      { withCredentials: true }
    );
  },

  //REPORTS
  //API:
  //http://localhost:5000/api/groups/5e39a5dcd92dfc45cc871308/balance

  getBalances(groupId) {
    // console.log('getBalances of a group', groupId);
    return axios.get(
      //
      `${this.endpoint}/groups/${groupId}/balance`,
      { withCredentials: true }
    );
  },

  getBills(groupId) {
    // console.log('getBills of a group', groupId);
    return axios.get(
      //
      `${this.endpoint}/groups/${groupId}/historyExpenses`,
      { withCredentials: true }
    );
  },

  getSettles(groupId) {
    console.log('getSettles of a group', groupId);
    return axios.get(
      //
      `${this.endpoint}/groups/${groupId}/historySettles`,
      { withCredentials: true }
    );
  },
};
