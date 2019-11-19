class my_board
{
    constructor(rows=30, cols=30, bd_height=600, bd_width=600)
    {
        this.rows = rows;
        this.cols = cols;
        this.bd_height = bd_height;
        this.bd_width = bd_width;
        this.block_h = bd_height/rows;
        this.block_w = bd_width/cols;
        this.mode = "BLOCK"; //"GOAL", "BLOCK", "START"
        this.start = [];
        this.goal = [];
        
        this.bd_data = new Array(rows);
        for(var i=0;i<cols;i++)
        {
            this.bd_data[i] = new Array(cols).fill(0);
        }
        this.AddCanvas();
        this.RenderBoard();
    }

    clickEvent = event =>  {
        var x = event.pageX - this.canvas.offsetLeft;
        var y = event.pageY - this.canvas.offsetTop;

        var col = Math.floor(x/this.block_w);
        var row = Math.floor(y/this.block_h);
        


        if(this.bd_data[row][col]==0)
        {
            var bk_val = 0;
            var bk_col = '#000000';
            if(this.mode=="BLOCK")
            {
                bk_val = 1;
                bk_col = '#000000';
            }
    
            if(this.mode=="START")
            {
                bk_val = 2;
                bk_col = '#00cc66';
                
                if(this.start.length>0)
                    this.clearBlock(this.start[0], this.start[1]);
                this.start = [row,col];
            }
    
            if(this.mode=="GOAL")
            {
                bk_val = 3;
                bk_col = '#ff0000';
    
                if(this.goal.length>0)
                    this.clearBlock(this.goal[0], this.goal[1]);
                this.goal = [row,col];
            }

            this.bd_data[row][col] = bk_val;
            this.paintBlock(row,col,true,bk_col);
        }
        else
        {
            if(this.bd_data[row][col]==2)
            {
                this.start = [];
            }
            if(this.bd_data[row][col]==3)
            {
                this.goal = [];
            }
            this.bd_data[row][col] = 0;
            this.clearBlock(row, col); 
        }
        
    }

    AddCanvas()
    {
        var mycanvas = document.createElement("canvas");
        mycanvas.setAttribute("width", this.bd_width.toString());
        mycanvas.setAttribute("height",this.bd_height.toString() );
        mycanvas.setAttribute("style","border:1px solid #000000;");
        mycanvas.appendChild(document.createTextNode("Your browser does not support the canvas element."));

        this.canvas = mycanvas;

        // Add event listener for `click` events.
        mycanvas.addEventListener('click', this.clickEvent, false);
        // document.body.appendChild(mycanvas);
    }

    RenderBoard()
    {
        //
        var context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(var i=0;i<this.rows;i++)
        {
            for(var j=0;j<this.cols;j++)
            {
                if(this.bd_data[i][j]==0)
                    this.paintBlock(i, j);
                else if(this.bd_data[i][j]==1)
                    this.paintBlock(i, j, true);
            }
        }
    }
    clearBlock(row, col)
    {
        var context = this.canvas.getContext('2d');
        context.clearRect(col*this.block_w, row*this.block_h, this.block_w, this.block_h);
        this.paintBlock(row,col); 
    }
    paintBlock(row, col,filled=false, colour='#00000')
    {
        var context = this.canvas.getContext('2d');
        if(filled)
        {
            context.fillStyle = colour;
            context.fillRect(col*this.block_w, row*this.block_h, this.block_w, this.block_h);
        }
        else
        {
            context.beginPath();
            context.lineWidth = "1";
            context.strokeStyle ='#00000';
            context.rect(col*this.block_w, row*this.block_h , this.block_w, this.block_h);
            context.stroke();
        }
    }
    setMode(mode)
    {
        var ref = ["GOAL","START","BLOCK"];
        if(ref.includes(mode))
            this.mode = mode;
    }
    clearBoard()
    {
        for(var i=0;i<this.rows;i++)
        {
            for(var j=0;j<this.cols;j++)
            {
                this.bd_data[i][j]=0;
            }
        }
        this.RenderBoard();
    }
    runAstar()
    {
        if(this.start.length>0 && this.goal.length>0)
        {

        }
    }
}

class grid_panel
{
    constructor()
    {
        this.bd1 = new my_board();
        this.div_grid = document.createElement("div");
        this.div_grid.appendChild(this.bd1.canvas);

        var div_button = document.createElement("div");
        this.buttons = [];

        var bt_setStart = document.createElement("button");
        bt_setStart.appendChild(document.createTextNode("Set Start"));
        bt_setStart.addEventListener("click", this.setStart);
        this.buttons.push(bt_setStart);

        var bt_setGoal = document.createElement("button");
        bt_setGoal.appendChild(document.createTextNode("Set Goal"));
        bt_setGoal.addEventListener("click", this.setGoal);
        this.buttons.push(bt_setGoal);

        var bt_setBlock = document.createElement("button");
        bt_setBlock.appendChild(document.createTextNode("Set Block"));
        bt_setBlock.addEventListener("click", this.setBlock);
        this.buttons.push(bt_setBlock);

        var bt_clear = document.createElement("button");
        bt_clear.appendChild(document.createTextNode("Clear"));
        bt_clear.addEventListener("click", this.clearBt);
        this.buttons.push(bt_clear);
        
        // Add all buttons to division
        this.buttons.forEach(function(element){div_button.appendChild(element);});
        this.div_button = div_button;

        document.body.appendChild(this.div_button);
        document.body.appendChild(this.div_grid);
    }

    clearBt = e =>{this.bd1.clearBoard();}
    setStart = e =>{this.bd1.mode = "START";}
    setGoal = e =>{this.bd1.mode = "GOAL";}
    setBlock = e =>{this.bd1.mode = "BLOCK";}
}

gd1 = new grid_panel();