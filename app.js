const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const email = process.env.EMAIL_VAPID;

webpush.setVapidDetails(email, publicVapidKey, privateVapidKey);

app.use(express.static(path.join(__dirname, "client")));

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  subscriptions.push(subscription);

  res.status(201).json({});
});

app.post("/trigger-notification", (req, res) => {
  const message = req.body.message || "Nueva notificación desde el servidor!";

  subscriptions.forEach((subscription) => {
    const payload = JSON.stringify({
      title: "Notificación Forzada",
      body: message,
    });
    webpush.sendNotification(subscription, payload).catch((error) => {
      console.error("Error al enviar notificación: ", error);
    });
  });

  res.status(200).json({ message: "Notificaciones enviadas." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
