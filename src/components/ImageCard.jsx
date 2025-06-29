function ImageCard() {
  const sampleImage = './images/generated-placeholder-image.jpg'

  return (
    <div className="rounded-xl shadow bg-white p-4 text-center">
      <img
        src={sampleImage}
        alt="Generated result"
        className="rounded-xl mx-auto mb-4"
      />
      <p className="text-gray-700">"Astronaut riding a horse in a futuristic city"</p>
    </div>
  )
}

export default ImageCard
