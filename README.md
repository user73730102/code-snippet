# My DevOps Project Dashboard

### CI/CD Pipeline Status

[![CI/CD Pipeline with Docker](https://github.com/user73730102/code-snippet/actions/workflows/node.js.yml/badge.svg)](https://github.com/user73730102/code-snippet/actions/workflows/node.js.yml)

This badge shows the real-time status of the last run on the `main` branch.

---

### Pipeline Flowchart

This flowchart is updated automatically by our CI/CD pipeline after every run.

```mermaid
graph TD
    %% Define styles
    classDef default fill:#fafafa,stroke:#333,stroke-width:2px,color:#333
    classDef success fill:#2da44e,stroke:#2da44e,stroke-width:2px,color:#fff
    classDef failure fill:#d73a49,stroke:#d73a49,stroke-width:2px,color:#fff
    classDef running fill:#dbab09,stroke:#dbab09,stroke-width:2px,color:#fff
    classDef skipped fill:#6a737d,stroke:#6a737d,stroke-width:2px,color:#fff

    %% Define the new, complete flowchart structure
    A[Start] --> B(Push Event);
    subgraph "Parallel Testing"
        B --> C{Test Server};
        B --> D{Test Client};
    end
    C --> E(Build & Push Images);
    D --> E;
    E --> F{Deploy};
    F --> G[End];

    %% Apply default styles to each node individually
    class A default;
    class B default;
    class C success;
    class D failure;
    class E skipped;
    class F skipped;
    class G default;
```
