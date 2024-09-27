import { useState, useRef } from 'react'

const Circle = ({ animateStyle, animateRef, size, division, pathId, createCirclePath, array, radius, ymkoko, pidennys }) => {
  const center = ymkoko / 2
  const angleStep = 360 / array.length
  return (
    <div id="animate" style={animateStyle} ref={animateRef}>
      <svg width={size / division} height={size / division}>
        <defs>
          <path id={pathId} d={createCirclePath()} />
        </defs>

        {array.map((_, index) => {
          const angle = (angleStep * index) - 90
          const angleInRadians = (angle * Math.PI) / 180
          const x = center + radius * pidennys * Math.cos(angleInRadians)
          const y = center + radius * pidennys * Math.sin(angleInRadians)

          return (
            <line
              key={`line-${index}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="black"
              strokeWidth="2"
            />
          )
        })}

        {array.map((person, index) => {
          const startOffset = `${(index / array.length) * 100}%`
          return (
            <text key={index} fill="white" fontSize="12" fontWeight="bold">
              <textPath href={`#${pathId}`} startOffset={startOffset}>
                {person}
              </textPath>
            </text>
          )
        })}
      </svg>
    </div>
  )
}

const PersonForm = ({ newName, handleNewName, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNewName} /></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const App = () => {
  const [id, setId] = useState(null)
  const [rotation_person, setrotation_person] = useState(90)
  const [rotation_alcohol, setrotation_alcohol] = useState(90)// isot kirjsimet?
  const [rotation_mixer, setrotation_mixer] = useState(90)
  const animateRef = useRef(null)
  const size = 400
  let multiplier = 5
  let rounds = 1
  let randomIndex = 0
  let randomValue = 0

  const [newName, setNewName] = useState('')
  const [people, setPeople] = useState(['juha', 'teemu'])

  const containerStyle = {
    width: `${size * 2}px`,
    height: `${size * 2}px`,
    position: 'relative',
    background: 'yellow',
  }

  const animateStylePerson = {
    width: `${size}px`,
    height: `${size}px`,
    position: 'absolute',
    background: 'red',
    top: `${size / 2}px`,
    left: `${size / 2}px`,
    transform: `rotate(${rotation_person}deg)`,
    borderRadius: '50%',
  }

  const animateStyleAlcohol = {
    width: `${size / 1.3}px`,
    height: `${size / 1.3}px`,
    position: 'absolute',
    background: 'blue',
    top: `${size / 2 + size / 9 + 1.5}px`,
    left: `${size / 2 + size / 9 + 1.5}px`,
    transform: `rotate(${rotation_alcohol}deg)`,
    borderRadius: '50%',
  }

  const animateStyleMixer = {
    width: `${size / 2}px`,
    height: `${size / 2}px`,
    position: 'absolute',
    background: 'green',
    top: `${size / 2 + size / 6 + size / 12}px`,
    left: `${size / 2 + size / 6 + size / 12}px`,
    transform: `rotate(${rotation_mixer}deg)`,
    borderRadius: '50%',
  }

  const rotate = () => {
    if (id) {
      clearInterval(id)
    }
    const newId = setInterval(frame, 5)
    setId(newId)
    randomIndex = Math.floor(Math.random() * people.length)
    const x = 360 / people.length * randomIndex
    const y = 360 / people.length * (randomIndex + 1)
    if (randomIndex > 0) randomValue = Math.floor(Math.random() * (y - x + 1)) + x
    else randomValue = Math.floor(Math.random() * (y - x + 1)) + x
    console.log(randomIndex, randomValue, people[randomIndex])
  }

  const frame = () => {
    if (rounds === 0) {
      clearInterval(id)
      return
    }
    multiplier *= 0.999

    setrotation_person((prevrotation_person) => {
      let newRotation = prevrotation_person + multiplier

      if (newRotation > randomValue) {//katso että pysähtyy oikeaan kohtaan
        newRotation -= 360
        rounds -= 1
      }

      return newRotation
    })

    setrotation_alcohol((prevrotation_alcohol) => prevrotation_alcohol + multiplier)
    setrotation_mixer((prevrotation_mixer) => prevrotation_mixer + multiplier)
  }

  const createCirclePath = (radius, ymkoko) => {
    const center = ymkoko / 2
    return `M ${center},${center} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`
  }

  const handleNewName = (event) => setNewName(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.trim()) {
      setPeople([...people, newName])
      setNewName("")
    }
  }

  return (
    <div>
      <div id="container" style={containerStyle}>
        <Circle
          animateStyle={animateStylePerson}
          animateRef={animateRef}
          size={size}
          division={0.8}
          pathId="circlePath1"
          createCirclePath={() => createCirclePath(size / 2.3, size)}
          array={people}
          radius={size / 2.3}
          ymkoko={size}
          pidennys={1.15}
        />
        <Circle
          animateStyle={animateStyleAlcohol}
          animateRef={animateRef}
          size={size}
          division={1.3}
          pathId="circlePath2"
          createCirclePath={() => createCirclePath(size / 3.2, size / 1.3)}
          array={["absintti", "vodka"]}
          radius={size / 3.2}
          ymkoko={size / 1.3}
          pidennys={1.25}
        />
        <Circle
          animateStyle={animateStyleMixer}
          animateRef={animateRef}
          size={size}
          division={2}
          pathId="circlePath3"
          createCirclePath={() => createCirclePath(size / 5.4, size / 2)}
          array={["fanta", "pepsi"]}
          radius={size / 5.4}
          ymkoko={size / 2}
          pidennys={1.35}
        />
      </div>
      <button onClick={rotate}>perkele</button>
      <PersonForm
        newName={newName}
        handleNewName={handleNewName}
        addPerson={addPerson}
      />
    </div>
  )
}

export default App
