canvas = document.getElementById("myCanvas");
ct = canvas.getContext("2d");
/* const colors = 
{
    white: '#ffffff',
    black: '#000000',
    blue: '#210f72'
}
*/
canvas.width = 700;
canvas.height = 700;
ct.fillStyle = "#210f72"; //
ct.fillRect(0,0,canvas.width,canvas.height);
class Bullet 
{
    constructor(x,y,angle,v,radius,color)
    {
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.v=v;
        this.radius=radius;
        this.color=color; 
    }
    render(ct)
    {
        ct.beginPath();
        ct.fillStyle = this.color;
        ct.arc(
            this.x, this.y,
            this.radius, 0, Math.PI*2, false);
        ct.fill();
        ct.closePath();
        if(this.health<=0) 
        {
            this.alive=false;
        }
    }
    is_alive() 
    {
        return this.alive;
    }
    getx() 
    {
        return this.x;
    }
    gety() 
    {
        return this.y;
    }
    getradius() 
    {
        return this.radius;
    }
    // possibly add acceleration
    move()  
    {
        let vx=(this.v)*Math.cos(this.angle);
        let vy=(this.v)*Math.sin(this.angle);
        this.x+=vx;
        this.y-=vy;
    }
    setx(x) 
    {
        this.x=x;
    }
    sety(y) 
    {
        this.y=y;
    }


}


/*we need a bullets array*/
class Gun 
{
    constructor(x,y,orientation,radius,health,color) 
    {
        this.x=x;
        this.y=y;
        this.orientation=orientation;
        this.radius=radius;
        this.health=health;
        this.color=color;
    }
    render(ct)
    {
        ct.fillStyle = this.color;
        ct.beginPath();
        ct.arc(
            this.x, this.y,
            this.radius, 0, Math.PI*2, false);
        ct.fill();
        ct.closePath();
        if(this.health<=0) 
        {
            this.alive=false;
        }
    }
    is_alive() 
    {
        return this.alive;
    }
    fire(bullets) 
    {
        let velocity_x=1; /* proper code for velocity_x, velocity_y */
        let velocity_y=1;
        bullets.push(Bullet(this.x, this.y, this.orientation, velocity_x, velocity_y));
    }
    getx() 
    {
        return this.x;
    }
    gety() 
    {
        return this.y;
    }
    getradius() 
    {
        return this.radius;
    }
    getangle() 
    {
        return this.orientation; //bad naming
    }
    gethealth() 
    {
        return this.health;
    }
    reduce_health(health_to_be_reduced) 
    {
        this.health-=health_to_be_reduced;
    }
}

class Wall 
{
    constructor(x,y,angle,health,length,color) 
    {
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.health=health;
        this.length=length;
        this.x1=x-(length/2.0)*Math.cos(angle);
        this.x2=x+(length/2.0)*Math.cos(angle);
        this.y1=y+(length/2.0)*Math.sin(angle);
        this.y2=y-(length/2.0)*Math.sin(angle);
        this.color=color;
        this.alive=true;
    }
    render(ct)
    {
        ct.lineWidth=10;
        ct.beginPath();
        ct.moveTo(this.x1,this.y1);
        ct.lineTo(this.x2,this.y2);
        ct.strokeStyle=this.color;
        ct.stroke();
        ct.closePath();
        if(this.health<=0) 
        {
            this.alive=false;
        }
    }
    /*
    ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(20, 100);
ctx.lineTo(70, 100);
ctx.strokeStyle = "red";
ctx.stroke();
*/
    
    getx() 
    {
        return this.x;
    }
    gety() 
    {
        return this.y;
    }
    getx1() 
    {
        return this.x1;
    }
    getx2() 
    {
        return this.x2;
    }
    gety1() 
    {
        return this.y1;
    }
    gety2() 
    {
        return this.y2;
    }
    is_alive() 
    {
        return this.alive;
    }
    collision_with_bullet(temp_bullet) 
    {
        let bullet_x=temp_bullet.getx();
        let bullet_y=temp_bullet.gety();
        let bullet_radius=temp_bullet.getradius();
        let AB=[];
        AB.push(this.x2-this.x1);
        AB.push(this.y2-this.y1);
        let BE=[];
        BE.push(bullet_x-this.x2);
        BE.push(bullet_y-this.y2);
        let AE=[];
        AE.push(bullet_x-this.x2);
        AE.push(bullet_y-this.y2);
        
        let AB_BE=(AB[0] * BE[0] + AB[1] * BE[1]);
        let AB_AE=(AB[0] * AE[0] + AB[1] * AE[1]);

        let reqAns = 0;

        if (AB_BE > 0) 
        {
            let y = bullet_y-this.y2;
            let x = bullet_x-this.x2;
            reqAns = Math.sqrt(x * x + y * y);
        }
 
        else if (AB_AE < 0) 
        {
            let y = bullet_y - this.y1;
            let x = bullet_x - this.x1;
            reqAns = Math.sqrt(x * x + y * y);
        }
        else 
        {
            let x1 = AB[0];
            let y1 = AB[1];
            let x2 = AE[0];
            let y2 = AE[1];
            let mod = Math.sqrt(x1 * x1 + y1 * y1);
            reqAns = Math.abs(x1 * y2 - y1 * x2) / mod;
        }

        if(reqAns<=bullet_radius) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
    reduce_health(health_reduced)
    {
        if(this.health>health_reduced) 
        {
            this.health-=health_reduced;
        }
        else 
        {
            this.health=0;
        }

    }
}

class Hero 
{
    constructor(x,y,orientation,angle,radius,health,stick_length,color)
    {
        this.x=x;
        this.y=y;
        this.orientation=orientation;
        this.angle=angle;
        this.radius=radius;
        this.health=health;
        this.stick_length=stick_length;
        this.color=color;
        this.x1=this.x+radius*Math.cos(angle);
        this.x2=this.x+(radius+stick_length)*Math.cos(angle);
        this.y1=this.x+radius*Math.sin(angle);
        this.y2=this.x+(radius+stick_length)*Math.sin(angle);
    }
    render(ct)
    {
        ct.fillStyle = this.color;
        ct.beginPath();
        ct.arc(
            this.x, this.y,
            this.radius, 0, Math.PI*2, false);
        ct.fill();
        ct.closePath();
        if(this.health<=0) 
        {
            this.alive=false;
        }
        this.x1=this.x+this.radius*Math.cos(this.angle);
        this.x2=this.x+(this.radius+this.stick_length)*Math.cos(this.angle);
        this.y1=this.y+this.radius*Math.sin(this.angle);
        this.y2=this.y+(this.radius+this.stick_length)*Math.sin(this.angle);
        ct.lineWidth=5;
        ct.beginPath();
        ct.moveTo(this.x1,this.y1);
        ct.lineTo(this.x2,this.y2);
        ct.strokeStyle=this.color; //we may need to change this
        ct.stroke();
        ct.closePath();
        //add the stick rendering to this
    }
    moveHero(direction)
    {
        this.orientation=direction; //make it smoother in animation 
        if(direction=='w')
        {
            this.y-=1;
        }
        if(direction=='s')
        {
            this.y+=1;
        }
        if(direction=='a')
        {
            this.x-=1;
        }
        if(direction=='d')
        {
            this.x+=1;
        }
    }
    getx()
    {
        return this.x;
    }
    gety()
    {
        return this.y;
    }
    getradius()
    {
        return this.radius;
    }

    collision_with_bullet(arb_bullet)
    {
        let bullet_x=arb_bullet.getx();
        let bullet_y=arb_bullet.gety();
        let bullet_radius=arb_bullet.getradius();
        if((this.x-bullet_x)*(this.x-bullet_x)+(this.y-bullet_y)*(this.y-bullet_y)<=(this.radius+bullet_radius)*(this.radius+bullet_radius)) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    collision_of_hero_with_gun(x,y,arb_gun)
    {
        let gun_x=arb_gun.getx();
        let gun_y=arb_gun.gety();
        let gun_radius=arb_gun.getradius();
        if((x-gun_x)*(x-gun_x)+(y-gun_y)*(y-gun_y)<=(this.radius+gun_radius)*(this.radius+gun_radius)) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    collision_with_wall(x,y,arb_wall) 
    {
        let x1=arb_wall.getx1();
        let x2=arb_wall.getx2();
        let y1=arb_wall.gety1();
        let y2=arb_wall.gety2();
        let AB=[];
        AB.push(x2-x1);
        AB.push(y2-y1);
        let BE=[];
        BE.push(x-x2);
        BE.push(y-y2);
        let AE=[];
        AE.push(x-x2);
        AE.push(y-y2);
        
        let AB_BE=(AB[0] * BE[0] + AB[1] * BE[1]);
        let AB_AE=(AB[0] * AE[0] + AB[1] * AE[1]);

        let reqAns = 0;

        if (AB_BE > 0) 
        {
            let y0 = y-y2;
            let x0 = x-x2;
            reqAns = Math.sqrt(x0 * x0 + y0 * y0);
        }
 
        else if (AB_AE < 0) 
        {
            let y0 = y - y1;
            let x0 = x - x1;
            reqAns = Math.sqrt(x0 * x0 + y0 * y0);
        }
        else 
        {
            let x11 = AB[0];
            let y11 = AB[1];
            let x21 = AE[0];
            let y21 = AE[1];
            let mod = Math.sqrt(x11 * x11 + y11 * y11);
            reqAns = Math.abs(x11 * y21 - y11 * x21) / mod;
        }

        if(reqAns<=this.radius) 
        {
            return true;
        }
        else 
        {
            return false;
        }

    }
    collision_with_gun(arb_gun) //stick actually
    {
        let gun_x=arb_gun.getx();
        let gun_y=arb_gun.gety();
        let gun_radius=arb_gun.getradius();
        let AB=[];
        AB.push(this.x2-this.x1);
        AB.push(this.y2-this.y1);
        let BE=[];
        BE.push(gun_x-this.x2);
        BE.push(gun_y-this.y2);
        let AE=[];
        AE.push(gun_x-this.x2);
        AE.push(gun_y-this.y2);
        
        let AB_BE=(AB[0] * BE[0] + AB[1] * BE[1]);
        let AB_AE=(AB[0] * AE[0] + AB[1] * AE[1]);

        let reqAns = 0;

        if (AB_BE > 0) 
        {
            let y = gun_y-this.y2;
            let x = gun_x-this.x2;
            reqAns = Math.sqrt(x * x + y * y);
        }
 
        else if (AB_AE < 0) 
        {
            let y = gun_y - this.y1;
            let x = gun_x - this.x1;
            reqAns = Math.sqrt(x * x + y * y);
        }
        else 
        {
            let x1 = AB[0];
            let y1 = AB[1];
            let x2 = AE[0];
            let y2 = AE[1];
            let mod = Math.sqrt(x1 * x1 + y1 * y1);
            reqAns = Math.abs(x1 * y2 - y1 * x2) / mod;
        }

        if(reqAns<=gun_radius) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    set_orientation(angle) 
    {
        this.angle=angle;
    }
    setx(x) 
    {
        this.x=x;
    }
    sety(y) 
    {
        this.y=y;
    }
    reduce_health(health_to_be_reduced) 
    {
        this.health-=health_to_be_reduced;
    }
    gethealth() 
    {
        return this.health;
    }

        
}
class RBRect
{
    constructor(x, y, width, height, color) 
    {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color=color;
    }
    render(ct)
    {
        ct.fillStyle = this.color;
        ct.beginPath();
        ct.fillRect(0, 0, 700, 700);
        ct.closePath();
    }
    
}
    //we will have to loop through all the guns in our array in main
/*     collision_with_gun(arb_gun) 
    {
        let gun_x=arb_gun.getx();
        let gun_y=arb_gun.gety();
        let gun_radius=arb_gun.getradius();
        //improve this condition by getting stick and orientation to work
        if((this.x-gun_x)*(this.x-gun_x)+(this.y-gun_y)*(this.y-gun_y)<=(this.radius+stick_length+gun_radius)*(this.radius+stick_length+gun_radius)) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    // movestick()


} */

/*  let angle = Math.atan2(this.vel.y, this.vel.x)
    let mag = Math.sqrt(this.vel.y*this.vel.y + this.vel.x*this.vel.x)
    angle = angle + amount*Math.random() - amount/2.0
    this.vel.x = mag*Math.cos(angle)
    this.vel.y = mag*Math.sin(angle) */

    //set up
    //let canvas = document.getElementById("myCanvas");
    //let ct = canvas.getContext("2d");
    
    let timeUnit = 1;
    let globalMouseX=0;
    let globalMouseY=0;
    let keypressed=' ';
    let start_date = new Date();

    
    let level = prompt("Select Level, from 1 to 300");
    

//edit health of everything from here
    let hero = new Hero(canvas.width/2.0, canvas.height/2.0, 'n', 0.0, 20.0, 3, 40.0, "#000000");
    let screen = new RBRect(0, 0, canvas.width, canvas.height, "#f80012");
    let guns = [];
    let bullets = [];
    let walls = [];
    let move_hero_x=0;
    let move_hero_y=0;
    guns.push(new Gun(0, 0, 315.0*Math.PI/180.00, 80, 3, "#ffffff"));
    guns.push(new Gun(canvas.width, canvas.height, 135.0*Math.PI/180.00, 80, 3, "#ffffff"));
    guns.push(new Gun(canvas.width, 0, 225.0*Math.PI/180.00, 80, 3, "#fffffff"));
    guns.push(new Gun(0, canvas.height, 45.0*Math.PI/180.00, 80, 3, "#ffffff"));
    guns.push(new Gun(canvas.width/2.0, 0, 270.0*Math.PI/180.00, 70, 3, "#ffffff"));
    guns.push(new Gun(0, canvas.height/2.0, 0.0*Math.PI/180.00, 70, 3, "#ffffff"));
    guns.push(new Gun(canvas.width/2.0, canvas.height, 90.0*Math.PI/180.00, 70, 3, "#ffffff"));
    guns.push(new Gun(canvas.width, canvas.height/2.0, 180.0*Math.PI/180.00, 70, 3, "#ffffff"));
    walls.push(new Wall(3.0*canvas.width/8.0, 3.0*canvas.height/8.0, 45.0*Math.PI/180.0, 3, 70, "#ffffff"));
    walls.push(new Wall(3.0*canvas.width/8.0, 5.0*canvas.height/8.0, 135.0*Math.PI/180.0, 3, 70, "#ffffff"));
    walls.push(new Wall(5.0*canvas.width/8.0, 3.0*canvas.height/8.0, 135.0*Math.PI/180.0, 3, 70, "#ffffff"));
    walls.push(new Wall(5.0*canvas.width/8.0, 5.0*canvas.height/8.0, 45.0*Math.PI/180.0, 3, 70, "#ffffff"));

    function update() 
    {
    ct.clearRect(0,0,canvas.width,canvas.height);
    screen.render(ct);
    let gun_array_length=guns.length;
    for(let theta=0; theta<gun_array_length; theta++) 
    {
        if(guns[theta].is_alive) 
        {
            guns[theta].render(ct);
        }
    }
    
    let wall_array_length=walls.length;
    for(let delta=0; delta<wall_array_length; delta++) 
    {
        if(walls[delta].is_alive) 
        {
            walls[delta].render(ct);
        }
    }
    let hero_x=hero.getx();
    let hero_y=hero.gety();
    let diff_in_y=globalMouseY-hero_y;
    let diff_in_x=globalMouseX-hero_x;
    let new_hero_orientation=Math.atan2(diff_in_y,diff_in_x);
    
    if(diff_in_x>0 && diff_in_y<0) 
    {
        new_hero_orientation+=Math.PI/180.0;
    }
    else if(diff_in_x<0 && diff_in_y>0) 
    {
        new_hero_orientation+=2*Math.PI/180.0;
    }
    else if(diff_in_x<0 && diff_in_y<0) 
    {
        new_hero_orientation+=Math.PI/180.0;
    }
    hero.set_orientation(new_hero_orientation);  //this is stupid naming, orientation should be angle everywhere here
    hero.render(ct);
    if(hero.getx()+move_hero_x>0 && hero.getx()+move_hero_x<canvas.width && hero.gety()+move_hero_y>0 && hero.gety()+move_hero_y<canvas.height) {
        let yesval=true;
        for(let omega=0; omega<walls.length; omega++) 
        {
            if(hero.collision_with_wall(hero.getx()+move_hero_x,hero.gety()+move_hero_y,walls[omega])) 
            {
                yesval=false;
                break;
            }
        }
        for(let phi=0; phi<guns.length; phi++) 
        {
            if(hero.collision_of_hero_with_gun(hero.getx()+move_hero_x,hero.gety()+move_hero_y,guns[phi])) 
            {
                yesval=false;
                break;
            }
        }
        if(yesval) 
        {
            hero.setx(hero.getx()+move_hero_x);
            hero.sety(hero.gety()+move_hero_y);
        }
    }
    let elapsed_time = new Date() - start_date;
    if(elapsed_time%(300-level)<0.00001) 
    {
        for(let kappa=0; kappa<guns.length; kappa++) 
        { //vx,vy to figure out
            if(guns[kappa].is_alive) 
            {
                bullets.push(new Bullet(guns[kappa].getx(),guns[kappa].gety(),guns[kappa].getangle(),1.0,5,"#ffffff"));
            }
        }
    }

    for(let gamma=0; gamma<bullets.length; gamma++) 
    {
        if(hero.collision_with_bullet(bullets[gamma])) 
        {
            bullets.splice(gamma,1);
            hero.reduce_health(1);
            break;
        }
    }
    
    let gun_length = guns.length;
    for(let psi=0; psi<gun_length; psi++) {
        if(hero.collision_with_gun(guns[psi])) {
            guns[psi].reduce_health(1);
        }
    }

    for(let beta=0; beta<bullets.length; beta++) 
    {
        //bullets[beta].setx(bullets[beta].getx()+1);
        //bullets[beta].sety(bullets[beta].gety()+1);
        bullets[beta].move();
    }
    for(let alpha=0; alpha<bullets.length; alpha++) 
    {
        if(bullets[alpha].is_alive)
        {
            bullets[alpha].render(ct);
        }
    }
    for(let epsilon=0; epsilon<guns.length; epsilon++) {
        if(guns[epsilon].gethealth()<=0) {
            guns.splice(epsilon, 1);
        }
    }

    if(hero.gethealth()<=0) 
    {
        alert("You lost");
    }
    if(guns.length==0) {
        alert("You won");
    }

    

}
setInterval(update,1);

onmousemove = function(e)
{
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
};

onkeydown = function(e)
{
    move_hero_x=0;
    move_hero_y=0;
    if (e.key == 'w') 
    {
        move_hero_y=-3;
    }
    else if(e.key=='a') 
    {
        move_hero_x=-3;
    }
    else if(e.key=='s') 
    {
        move_hero_y=3;
    }
    else if(e.key=='d') 
    {
        move_hero_x=3;
    }
};
//we have making the stick work left, and collision detection, and colours, and death of walls and stuff, and animation
//Code for bullets—every second, bullet's released and added to the main array of bullets, with appropriate velocity and orientation
//gun killing, stick movement, incorporating health for walls, guns and hero
