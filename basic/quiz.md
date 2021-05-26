1. 
    start
    IIFE
    end
    Timeout
    但 end 到 Timeout 時間會較久, 因 setTimeout 的時間延遲為 1000 ms

2. 
    start
    IIFE
    end
    Timeout
    雖然 setTimeout 的時間延遲為 0 ms, 但由於已進入 webapis, taskqueue, event loop 的流程, 因此需要等到 stack 做完並清空之後, 才會執行 setTimeout 程序裏面所要顯示的內容

3. 
    foo
    bar
    baz
    由於程式並没有呼叫 webapis, 故將按照順序, 先顯示 console.log("foo"), 再 bar(), 再 baz()

4. 
    foo
    baz
    bar
    同第二題, 雖然 setTimeout 的時間延遲為 0 ms, 但由於已進入 webapis, taskqueue, event loop 的流程, 故需等待 stack 做完並清空之後, 才會執行 setTimeout 程序裏面所要顯示的內容
    
    