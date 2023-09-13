const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// Подключение к MongoDB
mongoose.connect(
	"mongodb+srv://barbados:barbados123@doors-shop.vm267oz.mongodb.net/doors-shop",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

// Определение схемы и модели для items
const itemSchema = new mongoose.Schema(
	{
		id: String,
		category: String,
		title: String,
		price: Number,
		imageUrl: String,
		about: String,
	},
	{ collection: "items" }
);

const Item = mongoose.model("items", itemSchema);

// Разрешаем CORS, если нужно
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.use(cors());


// Разрешаем принимать JSON
app.use(express.json());

// Создаем маршруты для получения списка items
app.get("/items", async (req, res) => {
	try {
		const items = await Item.find({});
		res.json(items);
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

app.post("/orders", async (req, res) => {
	try {
		const orderData = req.body;

		// Сохраняем заказ в базу данных
		await mongoose.connection.collection("orders").insertOne(orderData);

		res.json({ success: true, message: "Order created successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});

app.get("/orders/count", async (req, res) => {
	try {
		const ordersCount = await mongoose.connection
			.collection("orders")
			.countDocuments();
		res.json({ count: ordersCount });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});
	


// Запуск сервера
app.listen(5000, () => {
});
