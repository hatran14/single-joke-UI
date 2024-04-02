let currentJokeId = null

const getRandomJoke = async () => {
	try {
    const votedJokes = JSON.stringify(getArrayOfVotedJokes())
    console.log("🚀 ~ getRandomJoke ~ votedJokes:", votedJokes)
		const response = await fetch(`https://single-joke-be.vercel.app/api/v1/jokes/random?votedJokes=${votedJokes}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
		const data = await response.json()
		// Check if there are no more jokes to show
		if (!data.metadata) {
      document.getElementById("joke-content").innerText = "No more jokes to show"
      document.getElementById("like-btn").style.display = "none"
      document.getElementById("dislike-btn").style.display = "none"
			alert("That's all the jokes for today! Come back another day!")
			return
		}
		currentJokeId = data.metadata._id
		document.getElementById("joke-content").innerText = data.metadata.text
	} catch (error) {
		console.log(error)
	}
}

const likeJoke = async (jokeId) => {
	try {
		await fetch(`https://single-joke-be.vercel.app/api/v1/jokes/${jokeId}/like`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.log(error)
	}
}

const dislikeJoke = async (jokeId) => {
	try {
		await fetch(`https://single-joke-be.vercel.app/api/v1/jokes/${jokeId}/dislike`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.log(error)
	}
}

const setCookie = (name, value) => {
	document.cookie = `${name}=${value};path=/`
}

const getArrayOfVotedJokes = () => {
  const cookies = document.cookie.split(";")
  const votedJokes = cookies
    .filter((cookie) => cookie.includes("voted-joke-"))
    .map((cookie) => cookie.split("=")[1])
  console.log(votedJokes)
  return votedJokes
}

document.getElementById("dislike-btn").addEventListener("click", () => {
	dislikeJoke(currentJokeId)
	setCookie(`voted-joke-${currentJokeId}`, currentJokeId)
	alert("You have disliked this joke")
	getRandomJoke()
})

document.getElementById("like-btn").addEventListener("click", () => {
	likeJoke(currentJokeId)
	setCookie(`voted-joke-${currentJokeId}`, currentJokeId)
	alert("You have liked this joke")
	getRandomJoke()
})
