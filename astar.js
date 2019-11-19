
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
            this.bd_data[row][col] = 1;
            this.paintBlock(row,col,true,'#000000');
        }
        else
        {
            this.bd_data[row][col] = 0;
            //Clear and draw
            this.clearBlock(row, col);
            // this.paintBlock(row,col,true,'#FFFFFF'); 
            this.paintBlock(row,col); 
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
        document.body.appendChild(mycanvas);
    }

    RenderBoard()
    {
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
}

bd1 = new my_board();