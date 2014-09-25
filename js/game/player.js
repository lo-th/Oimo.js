V3D.Player = function(root){
    this.parent = root;

	this.obj = new THREE.Object3D();
    this.velocity = new THREE.Vector3( 0, 0, 0 );
    this.rotation = new THREE.Vector3( 0, 0, 0 );
    this.newRotation = new THREE.Vector3( 0, 0, 0 );
    this.model = false;
    this.timeScale = 1;
    this.timeToStep = 0;
    this.isFrameStepping = false;
    this.animLength = 0;
    this.W = {R:0};
    this.isMove = false;

    this.levelOrigin = new THREE.Vector3(0,0,0);
    this.level = new THREE.Vector3(0,0,0);
    this.ease = new THREE.Vector3();
    this.easeRot = new THREE.Vector3();
    this.cfg = { speed:0.025, maxSpeed:0.25, G:0.4,  g:0, onGround:true, posY:0 };
};

V3D.Player.prototype = {
    constructor: V3D.Player,

    addModel:function(m, t){

        //var g = new THREE.BufferGeometry();
        //g.fromGeometry( m.geometry );

        this.hero = m.clone();
        //this.hero1 = m.clone();
        //this.hero2 = new THREE.SkinnedMesh(m.geometry,  new THREE.MeshBasicMaterial( {map:t, color:0xffffff, skinning:true } ), false );
        //this.hero2 = m.clone();

        this.hero.material = new THREE.MeshBasicMaterial( { map:t, color:0xffffff, skinning:true } );
        //this.hero1.material = new THREE.MeshBasicMaterial( { map:t, color:0xffffff, skinning:true } );
        //this.hero2.material = new THREE.MeshBasicMaterial( { map:t, color:0xffffff, skinning:true } );

        this.hero.name = m.name+"0";
        //this.hero1.name = m.name+"1";
        //this.hero2.name = m.name+"2";

        this.hero.position.set(0,0.9,0);
        //this.hero1.position.set(1,0.9,0);
        //this.hero2.position.set(-1,0.9,0)
        this.hero.scale.set(0.023,0.023,-0.023);
        //this.hero1.scale.set(0.023,0.023,-0.023);
        //this.hero2.scale.set(0.023,0.023,-0.023);

        //this.animations = this.hero.animations;
        this.animLength = this.hero.animations.length;
        var i = this.animLength;

        var name;
        var a0, a1, a2
        while(i--){
            name = this.hero.animations[i].name;
            if(name==='idle') this.W[name] = 1;
            else this.W[name] = 0;

            this.hero.animations[i].weight = this.W[name];
            this.hero.animations[i].play( 0, this.W[name] );

            //this.hero1.animations[i].weight = this.W[name];
            //this.hero1.animations[i].play( 0, this.W[name] );

            //this.hero2.animations[i].weight = this.W[name];
            //this.hero2.animations[i].play( 0, this.W[name] );
        }

        var bbox = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ) );

        this.obj.add(this.hero);
        //this.obj.add(bbox)
        //this.obj.add(this.hero1);
        //this.obj.add(this.hero2);

        this.parent.scene.add(this.obj);
        this.model = true;

        this.obj.position.y = 0.5;

        this.parent.nav.center = this.getPosition().clone();
        this.parent.nav.center.add(new THREE.Vector3(0, 1.2, 0));
        this.parent.nav.moveCamera();
    },
    update:function(delta){
        if(this.model){
            this.move();
            THREE.AnimationHandler.update( delta );
        }
    },
    move:function() {
        //this.updateBullets();
        
        //acceleration and speed limite
        var key = this.parent.nav.key;
        if (key[0]) this.ease.z = (this.ease.z > this.cfg.maxSpeed) ?  this.cfg.maxSpeed : this.ease.z+this.cfg.speed;
        if (key[1]) this.ease.z = (this.ease.z < -this.cfg.maxSpeed)? -this.cfg.maxSpeed : this.ease.z-this.cfg.speed;
        if (key[2]) this.ease.x = (this.ease.x > this.cfg.maxSpeed) ?  this.cfg.maxSpeed : this.ease.x+this.cfg.speed;
        if (key[3]) this.ease.x = (this.ease.x < -this.cfg.maxSpeed)? -this.cfg.maxSpeed : this.ease.x-this.cfg.speed;

        //deceleration
        if (!key[0] && !key[1]) {
            if (this.ease.z > this.cfg.speed) this.ease.z -= this.cfg.speed;
            else if (this.ease.z < -this.cfg.speed) this.ease.z += this.cfg.speed;
            else this.ease.z = 0;
        }
        if (!key[2] && !key[3]) {
            if (this.ease.x > this.cfg.speed) this.ease.x -= this.cfg.speed;
            else if (this.ease.x < -this.cfg.speed) this.ease.x += this.cfg.speed;
            else this.ease.x = 0;
        }

        // ease
        var mx = 0;
        var mz = 0;

        if(this.ease.z!==0 || this.ease.x!==0){
            if(this.ease.z>0){this.WalkFront(); mz = 1;}
            else if(this.ease.z<0){this.WalkBack(); mz = -1;}
            
            if(this.ease.x<0){this.stepLeft(mz);mx=-1}
            else if(this.ease.x>0){this.stepRight(mz);mx=1;}

            



        } else {
            this.stopWalk();
        }

        /*if(this.ease.z>0)this.player.startWalk();
        else this.player.stopWalk();

        if(this.ease.x>0)this.player.stepLeft();
        else if(this.ease.x<0)this.player.stepRight();
        else this.player.stopWalk();*/
        
        // stop if no move
        if (this.ease.x == 0 && this.ease.z == 0 && !this.parent.nav.mouse.down ) return;
        

        // find direction of player
        this.easeRot.y = this.parent.nav.camPos.h*V3D.ToRad;
        var rot =  this.parent.nav.unwrapDegrees(Math.round(this.parent.nav.camPos.h));
        this.easeRot.x = Math.sin(this.easeRot.y) * this.ease.x + Math.cos(this.easeRot.y) * this.ease.z;
        this.easeRot.z = Math.cos(this.easeRot.y) * this.ease.x - Math.sin(this.easeRot.y) * this.ease.z;

        this.setRotation(-(this.parent.nav.camPos.h+90)*V3D.ToRad);

        this.level.x = this.levelOrigin.x-this.easeRot.x;
        this.level.z = this.levelOrigin.z+this.easeRot.z;

        // update 2d map
        this.parent.miniMap.drawMap();

        // test pixel collision
        var nohitx = 0;
        var nohitz = 0;
        var lock = this.parent.miniMap.lock;

        if(rot >= 45 && rot <= 135){
            if(this.level.z < this.levelOrigin.z) if(!lock[0] && !lock[4] && !lock[5]) nohitz = 1;
            if(this.level.z > this.levelOrigin.z) if(!lock[1] && !lock[6] && !lock[7]) nohitz = 1;
            if(this.level.x < this.levelOrigin.x) if(!lock[2] && !lock[4] && !lock[6]) nohitx = 1;
            if(this.level.x > this.levelOrigin.x) if(!lock[3] && !lock[5] && !lock[7]) nohitx = 1;
        } else if (rot <= -45 && rot >= -135){
            if(this.level.z > this.levelOrigin.z) if(!lock[0] && !lock[4] && !lock[5]) nohitz = 1;
            if(this.level.z < this.levelOrigin.z) if(!lock[1] && !lock[6] && !lock[7]) nohitz = 1;
            if(this.level.x > this.levelOrigin.x) if(!lock[2] && !lock[4] && !lock[6]) nohitx = 1;
            if(this.level.x < this.levelOrigin.x) if(!lock[3] && !lock[5] && !lock[7]) nohitx = 1;
        } else if (rot < 45 && rot > -45){
            if(this.level.z > this.levelOrigin.z) if(!lock[2] && !lock[4] && !lock[6]) nohitz = 1;
            if(this.level.z < this.levelOrigin.z) if(!lock[3] && !lock[5] && !lock[7]) nohitz = 1;
            if(this.level.x < this.levelOrigin.x) if(!lock[0] && !lock[4] && !lock[5]) nohitx = 1;
            if(this.level.x > this.levelOrigin.x) if(!lock[1] && !lock[6] && !lock[7]) nohitx = 1;
        } else {
            if(this.level.z < this.levelOrigin.z) if(!lock[2] && !lock[4] && !lock[6]) nohitz = 1;
            if(this.level.z > this.levelOrigin.z) if(!lock[3] && !lock[5] && !lock[7]) nohitz = 1;
            if(this.level.x > this.levelOrigin.x) if(!lock[0] && !lock[4] && !lock[5]) nohitx = 1;
            if(this.level.x < this.levelOrigin.x) if(!lock[1] && !lock[6] && !lock[7]) nohitx = 1;
        }

        if(nohitx)this.levelOrigin.x = this.level.x;
        if(nohitz)this.levelOrigin.z = this.level.z;

        this.level.y = this.parent.miniMap.posY + this.cfg.posY;

        this.levelOrigin.y = this.level.y;

        // gravity
        if (this.cfg.onGround) this.cfg.g = 0;
        else this.cfg.g = this.cfg.G;
        this.ease.y += this.cfg.g * this.delta;

        // update 2d map
        this.parent.miniMap.updatePosition(this.levelOrigin.x, -this.easeRot.y, this.levelOrigin.z);

        //this.player.position.lerp(this.levelOrigin, 0.1);
        this.lerp(this.levelOrigin, 0.5);
        //this.sky.position.copy(player.position);
        this.parent.nav.center = this.getPosition().clone();
        this.parent.nav.center.add(new THREE.Vector3(0, 1.2, 0));
        this.parent.nav.moveCamera();
    },
    getPosition:function(){
    	return this.obj.position;
    },
    setPosition:function(x,y,z){
    	this.obj.position.set(x,y,z);
    },
    setRotation:function(y){
        //this.obj.rotation.y = y;
        this.rotation.y = y;
        if(this.isMove){
            this.newRotation.lerp(this.rotation, 0.25);
         this.obj.rotation.y = this.newRotation.y;
     }
        //this.obj.rotation.lerp(this.rotation, 0.5);
    },
    lerp:function(v,f){
    	this.obj.position.lerp(v,f);
    },
    WalkFront:function(){
        if(this.model){
            this.timeScale=1;
            this.easing({idle:0, walk:1, step_left:0, step_right:0});
            this.isMove = true;
        }
    },
    WalkBack:function(){
        if(this.model){
            this.timeScale=-1;
            this.easing({idle:0, walk:1, step_left:0, step_right:0});
            this.isMove = true;
        }
    },
    stepLeft:function(){
        if(this.model){
            this.easing({idle:0, walk:0, step_left:1, step_right:0});
            this.isMove = true;
        }
    },
    stepRight:function(){
        if(this.model){
            this.easing({idle:0, walk:0, step_left:0, step_right:1});
            this.isMove = true;
        }
    },
    stopWalk:function(){
        if(this.model){
            if(this.W['walk']!==0 || this.W['step_right']!==0 || this.W['step_left']!==0){ 
                this.easing({idle:1, walk:0, step_left:0, step_right:0});
                this.isMove = false;
            }
        }
    },
    stop:function(t){
    },
    easing:function(newW){
        var _this = this;
        var i = this.animLength;
        var name;/*, newW = {};
        while(i--){
            name = this.animations[i].name;
            if(n==name) newW[name] = 1;
            else if(full)newW[name] = 0; else { newW[name]=this.W; }
        }*/
        this.tween = new TWEEN.Tween( this.W )
            .to( newW, 200 )
            .easing( TWEEN.Easing.Linear.None )
            .onUpdate( function () {_this.weight()} )
            .start();
    },
    weight:function(t){
        var i = this.animLength;
        var name;
        var a0, a1, a2
        while(i--){
            a0 = this.hero.animations[i];
            //a1 = this.hero1.animations[i];
            //a2 = this.hero2.animations[i];

            name = a0.name;
            a0.weight = this.W[name];
            //a1.weight = this.W[name];
            //a2.weight = this.W[name];
            if(name=='walk'){
                a0.timeScale = this.timeScale;
                //a1.timeScale = this.timeScale;
                //a2.timeScale = this.timeScale;
            }
        }
    }


};