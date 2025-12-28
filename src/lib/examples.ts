import { Language } from "./url-state";

export const EXAMPLES: Record<Language, { name: string; content: string }[]> = {
  latex: [
    {
      name: "Pythagorean",
      content: `c = \\sqrt{a^2 + b^2}`
    },
    {
      name: "Maxwell",
      content: `\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\cdot \\mathbf{B} &= 0 \\\\
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0\\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)
\\end{aligned}`
    },
    {
        name: "Matrix",
        content: `A = \\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}`
    }
  ],
  mermaid: [
    {
      name: "Flowchart",
      content: `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]`
    },
    {
      name: "Sequence",
      content: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`
    },
    {
      name: "Gantt",
      content: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d`
    },
    {
      name: "Class Diagram",
      content: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`
    }
  ],
  markdown: [
    {
      name: "Hello World",
      content: `# Hello World

This is a **markdown** example.

- List item 1
- List item 2

\`\`\`javascript
console.log('Hello');
\`\`\`
`
    },
    {
      name: "Table",
      content: `| Name | Age | Role |
|------|-----|------|
| Alice| 24  | Dev  |
| Bob  | 30  | Lead |`
    }
  ],
  code: []
};

export const CODE_EXAMPLES: Record<string, { name: string; content: string }[]> = {
  javascript: [
    {
      name: "Event Listener",
      content: `document.getElementById('btn').addEventListener('click', () => {
  console.log('Clicked!');
});`
    },
    {
      name: "Fetch API",
      content: `fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));`
    }
  ],
  typescript: [
    {
      name: "Interface",
      content: `interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

function printUser(user: User) {
  console.log(\`\${user.name} (\${user.role})\`);
}`
    },
    {
      name: "Generics",
      content: `function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42);`
    }
  ],
  python: [
    {
      name: "Hello World",
      content: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`
    },
    {
      name: "List Comprehension",
      content: `numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(squares)`
    }
  ],
  json: [
    {
      name: "Config",
      content: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`
    }
  ],
  html: [
    {
      name: "Basic Structure",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`
    }
  ],
  css: [
    {
      name: "Flexbox",
      content: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}`
    }
  ],
  bash: [
    {
      name: "Script",
      content: `#!/bin/bash
echo "Starting build..."
npm install
npm run build
echo "Build complete!"`
    }
  ],
  markdown: [
    {
      name: "Headers",
      content: `# H1
## H2
### H3`
    }
  ],
  yaml: [
    {
      name: "GitHub Action",
      content: `name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2`
    }
  ],
  tsx: [
    {
      name: "Component",
      content: `import React from 'react';

export const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="p-4 border rounded">
    <h2 className="text-xl font-bold">{title}</h2>
    <div>{children}</div>
  </div>
);`
    }
  ],
  jsx: [
    {
      name: "Component",
      content: `function App() {
  return (
    <div className="App">
      <h1>Hello React</h1>
    </div>
  );
}`
    }
  ],
  go: [
    {
      name: "Hello World",
      content: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`
    },
    {
      name: "Goroutine",
      content: `package main

import (
	"fmt"
	"time"
)

func say(s string) {
	for i := 0; i < 5; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println(s)
	}
}

func main() {
	go say("world")
	say("hello")
}`
    }
  ],
  rust: [
    {
      name: "Hello World",
      content: `fn main() {
    println!("Hello, world!");
}`
    },
    {
      name: "Struct",
      content: `struct User {
    username: String,
    email: String,
    active: bool,
}

fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
    };
}`
    }
  ],
  java: [
    {
      name: "Class",
      content: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World");
    }
}`
    }
  ],
  c: [
    {
      name: "Main",
      content: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
    }
  ],
  cpp: [
    {
      name: "Class",
      content: `#include <iostream>
using namespace std;

class Rectangle {
  public:
    int width, height;
    int area() { return width * height; }
};

int main() {
  Rectangle rect;
  rect.width = 5;
  rect.height = 10;
  cout << "Area: " << rect.area() << endl;
  return 0;
}`
    }
  ],
  bibtex: [
    {
      name: "Bibliography",
      content: `@article{einstein,
    author = "Albert Einstein",
    title = "{Zur Elektrodynamik bewegter K{\\"o}rper}. ({German})
    [{On} the electrodynamics of moving bodies]",
    journal = "Annalen der Physik",
    volume = "322",
    number = "10",
    pages = "891--921",
    year = "1905",
    DOI = "http://dx.doi.org/10.1002/andp.19053221004",
    keywords = "physics"
}`
    }
  ],
  latex: [
    {
      name: "Equation",
      content: `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

\\section{Equations}
Maxwell's equations are a set of partial differential equations that, together with the Lorentz force law, form the foundation of classical electromagnetism:

\\begin{equation}
\\begin{aligned}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\
\\nabla \\cdot \\mathbf{B} &= 0 \\\\
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0\\left(\\mathbf{J} + \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}\\right)
\\end{aligned}
\\end{equation}

\\end{document}`
    }
  ],
  ruby: [
    {
      name: "Class",
      content: `class Greeter
  def initialize(name = "World")
    @name = name
  end

  def say_hi
    puts "Hi #{@name}!"
  end

  def say_bye
    puts "Bye #{@name}, come back soon."
  end
end

g = Greeter.new("Pat")
g.say_hi`
    }
  ],
  lisp: [
    {
      name: "Factorial",
      content: `(defun factorial (n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

(print (factorial 5))`
    }
  ],
  "emacs-lisp": [
    {
      name: "Message",
      content: `(defun hello-world ()
  (interactive)
  (message "Hello, world!"))

(hello-world)`
    }
  ],
  kotlin: [
    {
      name: "Main",
      content: `fun main() {
    println("Hello, World!")
}`
    },
    {
        name: "Class",
        content: `class Person(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}`
    }
  ],
  swift: [
    {
      name: "Hello World",
      content: `print("Hello, World!")`
    },
    {
        name: "Struct",
        content: `struct Person {
    var name: String
    
    func greet() {
        print("Hello, \\(name)")
    }
}`
    }
  ],
  mermaid: [
    {
      name: "Graph",
      content: `graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;`
    }
  ],
  "objective-c": [
    {
      name: "Hello World",
      content: `#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSLog(@"Hello, World!");
    }
    return 0;
}`
    }
  ],
  perl: [
    {
      name: "Hello World",
      content: `#!/usr/bin/perl
use strict;
use warnings;

print "Hello, World!\\n";`
    }
  ],
  php: [
    {
      name: "Hello World",
      content: `<?php
echo "Hello, World!";
?>`
    }
  ],
  r: [
    {
      name: "Plot",
      content: `x <- c(1, 2, 3, 4, 5)
y <- x^2
plot(x, y, main="Square Function")`
    }
  ],
  toml: [
    {
      name: "Config",
      content: `[package]
name = "hello_world"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]

[dependencies]
serde = "1.0"`
    }
  ],
  vhdl: [
    {
      name: "Flip Flop",
      content: `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity D_Flip_Flop is
    Port ( D, CLK : in STD_LOGIC;
           Q : out STD_LOGIC);
end D_Flip_Flop;

architecture Behavioral of D_Flip_Flop is
begin
    process(CLK)
    begin
        if rising_edge(CLK) then
            Q <= D;
        end if;
    end process;
end Behavioral;`
    }
  ],
  "system-verilog": [
    {
      name: "Module",
      content: `module d_ff (
    input clk,
    input rst_n,
    input d,
    output reg q
);

always @(posedge clk or negedge rst_n) begin
    if (!rst_n)
        q <= 1'b0;
    else
        q <= d;
end

endmodule`
    }
  ]
};
