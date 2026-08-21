const gallery = document.querySelector(".gallery");

const fruits = [
	{
		title: "kiwi",
		imageUrl:
			"images/Art/Art1.jpg"
	},
	{
		title: "banana",
		imageUrl:
			"images/Art/Art2.jpg"

	},
	{
		title: "ananas",
		imageUrl:
			"images/Art/Art3.jpg"
			
	},
	{
		title: "avocado",
		imageUrl:
			"images/Art/Art5.jpg"
	},
	{
		title: "orange",
		imageUrl:
		"images/Art/Art4.jpg"
	},
	{
		title: "strawberry",
		imageUrl:
		"images/Art/Art6.jpg"
	}
];

fruits.map((fruit) => {
	fruitElement = document.createElement("img");
	fruitElement.src = fruit.imageUrl;
	fruitElement.alt = fruit.title;
	gallery.append(fruitElement);
});

