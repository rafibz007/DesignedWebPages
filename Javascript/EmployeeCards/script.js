const nameField = document.querySelector('figure .name');
const positionField = document.querySelector('figure .position');
const articleField = document.querySelector('article');
const img = document.querySelector('figure img');
const source = document.querySelector('figure source');

const prevBtn = document.querySelector('.nav .prev');
const nextBtn = document.querySelector('.nav .next');
const randomBtn = document.querySelector('.random');

const employees = [
    {
        name : "Rafał Kamiński",
        position : "Full Stack Developer",
        description : "1 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, placeat eligendi! Magnam, vel quisquam inventore laboriosam corrupti, libero et nulla provident voluptatibus aut quidem deserunt, numquam qui dolores ducimus eveniet nobis esse labore totam error odio! Accusantium laudantium minus atque nemo rem. Dicta iusto laboriosam ex sapiente voluptates animi nemo veniam eveniet, culpa pariatur nihil ad perspiciatis magni neque dignissimos, totam id molestiae sed facilis eaque aperiam voluptatibus, delectus sint tempore. Ullam autem ea fuga tempora error ut veniam deserunt reprehenderit cum! Ratione dolor tempora repellat consectetur sed officiis maxime quisquam reprehenderit quis autem qui vitae, aliquid id exercitationem earum sequi animi quam cum ipsum minima deserunt porro.",
        imgSrc : "images/1/"
    },
    {
        name : "Albert Nowak",
        position : "Web Developer",
        description : "2 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, placeat eligendi! Magnam, vel quisquam inventore laboriosam corrupti, libero et nulla provident voluptatibus aut quidem deserunt, numquam qui dolores ducimus eveniet nobis esse labore totam error odio! Accusantium laudantium minus atque nemo rem. Dicta iusto laboriosam ex sapiente voluptates animi nemo veniam eveniet, culpa pariatur nihil ad perspiciatis magni neque dignissimos, totam id molestiae sed facilis eaque aperiam voluptatibus, delectus sint tempore. Ullam autem ea fuga tempora error ut veniam deserunt reprehenderit cum! Ratione dolor tempora repellat consectetur sed officiis maxime quisquam reprehenderit quis autem qui vitae, aliquid id exercitationem earum sequi animi quam cum ipsum minima deserunt porro.",
        imgSrc : "images/2/"
    },
    {
        name : "Mariusz Dziobak",
        position : "Senior Janitor",
        description : "3 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, placeat eligendi! Magnam, vel quisquam inventore laboriosam corrupti, libero et nulla provident voluptatibus aut quidem deserunt, numquam qui dolores ducimus eveniet nobis esse labore totam error odio! Accusantium laudantium minus atque nemo rem. Dicta iusto laboriosam ex sapiente voluptates animi nemo veniam eveniet, culpa pariatur nihil ad perspiciatis magni neque dignissimos, totam id molestiae sed facilis eaque aperiam voluptatibus, delectus sint tempore. Ullam autem ea fuga tempora error ut veniam deserunt reprehenderit cum! Ratione dolor tempora repellat consectetur sed officiis maxime quisquam reprehenderit quis autem qui vitae, aliquid id exercitationem earum sequi animi quam cum ipsum minima deserunt porro.",
        imgSrc : "images/3/"
    },
    {
        name : "Anna Julia",
        position : "CEO",
        description : "4 Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, placeat eligendi! Magnam, vel quisquam inventore laboriosam corrupti, libero et nulla provident voluptatibus aut quidem deserunt, numquam qui dolores ducimus eveniet nobis esse labore totam error odio! Accusantium laudantium minus atque nemo rem. Dicta iusto laboriosam ex sapiente voluptates animi nemo veniam eveniet, culpa pariatur nihil ad perspiciatis magni neque dignissimos, totam id molestiae sed facilis eaque aperiam voluptatibus, delectus sint tempore. Ullam autem ea fuga tempora error ut veniam deserunt reprehenderit cum! Ratione dolor tempora repellat consectetur sed officiis maxime quisquam reprehenderit quis autem qui vitae, aliquid id exercitationem earum sequi animi quam cum ipsum minima deserunt porro.",
        imgSrc : "images/4/"
    }
]

prevBtn.addEventListener('click', prev)
nextBtn.addEventListener('click', next)
randomBtn.addEventListener('click', random)

let currentIndex = 0;


function show(employeeIndex){
    nameField.innerText = employees[employeeIndex]['name'];
    positionField.innerText = employees[employeeIndex]['position'];
    articleField.innerText = employees[employeeIndex]['description'];
    img.src = employees[employeeIndex]['imgSrc'] + "1.jpg";
    img.alt = employees[employeeIndex]['name'] + " photo";
    source.srcset = employees[employeeIndex]['imgSrc'] + "2.jpg"
}

function next() {
    currentIndex = (currentIndex+1)%employees.length;
    show(currentIndex);
}

function prev() {
    currentIndex = ((currentIndex+employees.length-1)%employees.length);
    show(currentIndex);
}

function random(){
    let newIndex = Math.floor(Math.random()*employees.length);
    while (newIndex == currentIndex && employees.length > 1){
        newIndex = Math.floor(Math.random()*employees.length);
    }
    currentIndex = newIndex;
    show(currentIndex);
}


show(currentIndex);