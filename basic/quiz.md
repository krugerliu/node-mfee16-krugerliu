1. 
    start
    IIFE
    end
    Timeout
    但 end 到 Timeout 時間會較久, 因 setTimeout 為 1000

2. 
    start
    IIFE
    end
    Timeout
    但 end 到 Timeout 時間短, 因 setTimeout 為 0

3. 
    foo
    bar
    baz
    先 console.log("foo"), 再 bar(), 再 baz()

4. 
    foo
    baz
    bar
    先 console.log("foo"), 再 baz(), 再出現 setTimeout(bar, 0)
    
    