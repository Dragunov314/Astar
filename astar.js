function BinaryHeap(scoreFunction){
        this.content = [];
        this.scoreFunction = scoreFunction;
}
  
BinaryHeap.prototype = {
    includes: function(node)
    {
        for (var i = 0; i < this.content.length; i++) 
        {
            if ( this.isEquivalent(this.content[i], node))
            {
                return true;
            }
        }
        return false;
    },
    isEquivalent: function (a, b) {
        if(a["pt"].row==b["pt"].row && a["pt"].col==b["pt"].col)
        {
            return true;
        }
        else
            return false;
    },

    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },
  
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },
  
    remove: function(node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
            if ( this.isEquivalent(this.content[i], node)==false) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i == length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    },
  
    size: function() {
        return this.content.length;
    },
  
    bubbleUp: function(n) {
        // Fetch the element that has to be moved.
        var element = this.content[n], score = this.scoreFunction(element);
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.scoreFunction(parent))
            break;
    
            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    },
  
    sinkDown: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);
    
        while(true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
            // Look it up and compute its score.
            var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
            // If the score is less than our element's, we need to swap.
            if (child1Score < elemScore)
                swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
            var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
            if (child2Score < (swap == null ? elemScore : child1Score))
                swap = child2N;
            }
    
            // No need to swap further, we are done.
            if (swap == null) break;
    
            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    }
  };

class coord
{
    constructor(row, col)
    {
        this.row = row;
        this.col = col;
    }

    l2dist(cd2)
    {
        var r_dif = cd2.row-this.row;
        var c_dif = cd2.col-this.col;
        return Math.sqrt(r_dif*r_dif + c_dif*c_dif);
    }
    
    toString()
    {
        return "("+this.row+","+this.col+")";
    }
}

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
        this.border_color = "#000000";
        
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
            var bk_type = "BLOCK";
            // console.log("MODE = "+this.mode);
            if(this.mode=="BLOCK")
            {
                bk_val = 1;
                bk_type = "BLOCK";
            }
    
            if(this.mode=="START")
            {
                bk_val = 2;
                bk_type = "START";
                
                if(this.start.length>0)
                {
                    this.bd_data[this.start[0].row][this.start[0].col] = 0;
                    this.paintBlock(this.start[0].row, this.start[0].col,"BLANK");
                }
                    
                this.start = [];
                this.start.push(new coord(row,col));
            }
    
            if(this.mode=="GOAL")
            {
                bk_val = 3;
                bk_type = "GOAL";
    
                if(this.goal.length>0)
                {
                    this.bd_data[this.goal[0].row][this.goal[0].col] = 0;
                    this.paintBlock(this.goal[0].row, this.goal[0].col,"BLANK");
                }
                    
                this.goal = [];
                this.goal.push(new coord(row,col));
            }

            this.bd_data[row][col] = bk_val;
            this.paintBlock(row,col,bk_type);
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
            this.paintBlock(row,col,"BLANK");
        }
        
    }

    AddCanvas()
    {
        var mycanvas = document.createElement("canvas");
        mycanvas.setAttribute("width", this.bd_width.toString());
        mycanvas.setAttribute("height",this.bd_height.toString() );
        mycanvas.setAttribute("style","border:0px solid #000000;");
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
                else if(this.bd_data[i][j]==1) // Block
                    this.paintBlock(i, j,"BLOCK");
                else if(this.bd_data[i][j]==2) // Start
                    this.paintBlock(i, j, "START");
                else if(this.bd_data[i][j]==3) // Goal
                    this.paintBlock(i, j, "GOAL");
                else if(this.bd_data[i][j]==4) // Walked
                    this.paintBlock(i, j, "WALKED");
                else if(this.bd_data[i][j]==5) // In heap
                    this.paintBlock(i, j, "HEAP");
                
            }
        }
    }
    clearBlock(row, col)
    {
        var context = this.canvas.getContext('2d');
        context.clearRect(col*this.block_w, row*this.block_h, this.block_w, this.block_h);
        // context.fillStyle = "#FFFFFF";
        // context.fillRect(col*this.block_w, row*this.block_h, this.block_w, this.block_h);
    }
    paintBlock(row, col, type="BLANK")
    {
        var ref_col = {"BLOCK":this.border_color,"BLANK":"#000000","START":"#00cc66","GOAL":"#ff0000","HEAP":"#ffff00","WALKED":"#ff9933"};
        var context = this.canvas.getContext('2d');
        
        if(type!="BLANK")
        {
            this.clearBlock(row, col);
            // console.log(ref_col[type]);
            context.fillStyle = ref_col[type];
            context.fillRect(col*this.block_w, row*this.block_h, this.block_w, this.block_h);
        }
        else
        {
            this.clearBlock(row, col);
            context.beginPath();
            context.lineWidth = "1";
            context.strokeStyle =this.border_color;
            context.rect(col*this.block_w, row*this.block_h , this.block_w, this.block_h);
            context.stroke();
        }
    }
    setMode(mode)
    {
        var ref = ["GOAL","START","BLOCK"];
        console.log(mode);
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
        this.start=[];
        this.goal=[];
        this.RenderBoard();
    }
    runAstar()
    {
        this.RenderBoard();
        if(this.start.length>0 && this.goal.length>0)
        {
            this.start.forEach(val=>console.log("START = "+val));
            this.goal.forEach(val=>console.log("GOAL = "+val));
            //Initialize parent
            var parent =new Array(this.rows);
            for(var i=0;i<this.rows;i++)
            {
                parent[i] = [];
                for(var j=0;j<this.cols;j++)
                    parent[i].push(new coord(0,0));
            }
                

            //Initialize G score
            var g_score =new Array(this.rows);
            for(var i=0;i<this.rows;i++)
                g_score[i] = new Array(this.cols).fill(Number.MAX_SAFE_INTEGER);
            g_score[this.start[0].row][this.start[0].col] = 0;

            //Initialize H score
            var h_score =new Array(this.rows);
            for(var i=0;i<this.rows;i++)
                h_score[i] = new Array(this.cols).fill(0);
            
            for(var i=0;i<this.rows;i++)
                for(var j=0;j<this.cols;j++)
                    h_score[i][j] = this.goal[0].l2dist(new coord(i,j));
                
            //Initialize F score
            var f_score =new Array(this.rows);
            for(var i=0;i<this.rows;i++)
                f_score[i] = new Array(this.cols).fill(Number.MAX_SAFE_INTEGER);
            f_score[this.start[0].row][this.start[0].col] = h_score[this.start[0].row][this.start[0].col];

            var min_hp = new BinaryHeap(function(x){return x["key"];});
            min_hp.push({"pt": this.start[0],"key":f_score[this.start[0].row][this.start[0].col]});

            while(min_hp.content.length>0)
            {
                var min_node = min_hp.pop();
                console.log("POPPED = "+min_node["pt"]);
                // If reached goal
                if(min_node["pt"].row == this.goal[0].row && min_node["pt"].col == this.goal[0].col)
                {
                    break;
                }
                var nbs = this.getNeighbors(min_node["pt"]);

                for(var i=0;i<nbs.length;i++)
                {
                    if(g_score[min_node["pt"].row][min_node["pt"].col]+1 < g_score[nbs[i].row][nbs[i].col])
                    {
                        parent[nbs[i].row][nbs[i].col] = min_node["pt"];
                        
                        // console.log(nbs[i] + " => "+parent[nbs[i].row][nbs[i].col]);
                        
                        g_score[nbs[i].row][nbs[i].col] = g_score[min_node["pt"].row][min_node["pt"].col]+1;
                        f_score[nbs[i].row][nbs[i].col] = g_score[nbs[i].row][nbs[i].col] + h_score[nbs[i].row][nbs[i].col];

                        var heap_node = {"pt":nbs[i],"key":f_score[nbs[i].row][nbs[i].col]};
                        if(min_hp.includes(heap_node))
                            min_hp.remove(heap_node);
                        min_hp.push(heap_node);
                    }
                }
            }
            var next_pt = parent[this.goal[0].row][this.goal[0].col];
            
            while( (next_pt.row==this.start[0].row && next_pt.col==this.start[0].col)==false)
            {
                console.log("WALKED = "+next_pt);
                this.paintBlock(next_pt.row,next_pt.col,"WALKED");
                next_pt = parent[next_pt.row][next_pt.col];
            }
            console.log("A* finished!");
        }
    }

    getNeighbors(pt)
    {
        var result = [];
        const row_dif = [1,-1,0,0];
        const col_dif = [0,0,1,-1];
        for(var i=0;i<row_dif.length;i++)
        {
            var r_t = pt.row + row_dif[i];
            var c_t = pt.col + col_dif[i];
            if(r_t>=0 && c_t>=0 && r_t < this.rows && c_t < this.cols)
            {
                var bk_val = this.bd_data[r_t][c_t];
                if(bk_val==0 || bk_val==3)
                {
                    if((r_t==this.goal[0].row && c_t==this.goal[0].col)==false)
                    {
                        this.paintBlock(r_t,c_t,"HEAP");
                        
                    }

                    result.push(new coord(r_t,c_t));
                }
            }
        }

        return result;
    }
}

class grid_panel
{
    constructor()
    {
        this.bd1 = new my_board();
        this.div_grid = document.createElement("div");
        this.div_grid.appendChild(this.bd1.canvas);

        this.div_grid.appendChild(document.createElement("br"));
        var github_link = document.createElement("a");
        github_link.setAttribute("href","https://github.com/Dragunov314/Astar");
        github_link.appendChild(document.createTextNode("Source Code"));
        this.div_grid.appendChild(github_link);

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

        var bt_runAstar = document.createElement("button");
        bt_runAstar.appendChild(document.createTextNode("Run A*"));
        bt_runAstar.addEventListener("click", this.runAstar);
        this.buttons.push(bt_runAstar);

        var bt_clear = document.createElement("button");
        bt_clear.appendChild(document.createTextNode("Clear"));
        bt_clear.addEventListener("click", this.clearBt);
        this.buttons.push(bt_clear);
        
        // Add all buttons to division
        var title = document.createElement("h1");
        title.appendChild(document.createTextNode("A* ALGORITHM VISUALIZATION"));
        div_button.appendChild(title);
        div_button.appendChild(document.createElement("br"));
        this.buttons.forEach(function(element){element.setAttribute("class","button");div_button.appendChild(element);});
        this.div_button = div_button;
        this.div_button.setAttribute("align","center");
        this.div_grid.setAttribute("align","center");

        
        
        document.body.appendChild(this.div_button);
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(this.div_grid);
    }

    runAstar = e =>{this.bd1.runAstar();}
    clearBt = e =>{this.bd1.clearBoard();}
    setStart = e =>{this.bd1.mode = "START";}
    setGoal = e =>{this.bd1.mode = "GOAL";}
    setBlock = e =>{this.bd1.mode = "BLOCK";}
}

gd1 = new grid_panel();
document.title = "A* ALGORITHM VISUALIZATION";
document.body.style.backgroundColor = "#b3f0ff";
// test = [{"pt":new coord(3,1),"key":4},{"pt":new coord(3,2),"key":9},{"pt":new coord(3,3),"key":8},{"pt":new coord(3,4),"key":7},{"pt":new coord(9,1),"key":3}]
// var hp = new BinaryHeap(function(x){return x["key"];});

// test.forEach(val => {hp.push(val)});

// hp.remove({"pt":new coord(3,4),"key":0});
// hp.push({"pt":new coord(3,4),"key":12});
// while (hp.size() > 0)
// {
//     min_val = hp.pop();
//     console.log(min_val);
    
// }