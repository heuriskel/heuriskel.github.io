/* global THREE */
const canvas = document.querySelector("#scene")
let width = canvas.offsetWidth
let height = canvas.offsetHeight

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
renderer.setSize(width, height)
// renderer.setClearColor(0x191919)
renderer.setClearColor(0x263238)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
camera.position.set(0, 0, 280)

const sphere = new THREE.Group()
scene.add(sphere)

const materials = [0xe91e63, 0x2196f3, 0x4caf50, 0xffc107].map(
  (c) => new THREE.LineBasicMaterial({ color: c, linewidth: 1.5 })
)
const defaultMaterial = new THREE.LineBasicMaterial({ color: 0x455a64 })

const radius = 90
const lines = 64
const dots = 32
const getRandomMaterial = () => materials[Math.floor(Math.random() * 4)]
for (let i = 0; i < lines; i++) {
  const geometry = new THREE.Geometry()
  const line = new THREE.Line(
    geometry,
    Math.random() > 0.2 ? defaultMaterial : getRandomMaterial()
  )
  line.speed = Math.random() * 300 + 250
  line.wave = Math.random()
  line.radius = Math.floor(radius + (Math.random() - 0.5) * (radius * 0.2))
  for (let j = 0; j < dots; j++) {
    const x = (j / dots) * line.radius * 2 - line.radius
    const vector = new THREE.Vector3(x, 0, 0)
    geometry.vertices.push(vector)
  }
  line.rotation.x = Math.random() * Math.PI
  line.rotation.y = Math.random() * Math.PI
  line.rotation.z = Math.random() * Math.PI
  sphere.add(line)
}

function updateDots(a) {
  for (let i = 0; i < lines; i++) {
    const line = sphere.children[i]
    for (let j = 0; j < dots; j++) {
      const vector = sphere.children[i].geometry.vertices[j]
      const ratio = 1 - (line.radius - Math.abs(vector.x)) / line.radius
      const y = Math.sin(a / line.speed + j * 0.15) * 12 * ratio
      vector.y = y
    }
    line.geometry.verticesNeedUpdate = true
  }
}

function render(a) {
  requestAnimationFrame(render)
  updateDots(a)
  sphere.rotation.y = a * 0.0001
  sphere.rotation.x = -a * 0.0001
  renderer.render(scene, camera)
}

function onResize() {
  canvas.style.width = ""
  canvas.style.height = ""
  width = canvas.offsetWidth
  height = canvas.offsetHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

requestAnimationFrame(render)
let resizeTm
window.addEventListener("resize", () => {
  resizeTm = clearTimeout(resizeTm)
  resizeTm = setTimeout(onResize, 200)
})
