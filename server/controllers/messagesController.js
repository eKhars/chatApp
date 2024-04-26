import Messages from "../model/messageModel.js";

let subscribers = [];

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      notifySubscribers(); 
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    next(ex);
  }
};

const notifySubscribers = () => {
  while (subscribers.length > 0) {
    const subscriber = subscribers.shift();
    subscriber(true);
  }
};
export const getNotifies = async (req, res) => {
  try {
    while (true) {
      const hasMessage = await new Promise((resolve) => {
        subscribers.push(resolve);
        setTimeout(() => resolve(false), 20000); 
      });

      if (hasMessage) {
        res.json({ msg: "New message received" });
        return; 
      } else {
   
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


