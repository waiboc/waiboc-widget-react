# [Waiboc](https://www.waiboc.com) Chatbots

Waiboc is intended to spread the use of Chatbot and AI to business of all kinds

## Installation

#### npm
```bash
npm install --save  waiboc-widget-react
```
## Usage

1- Import the component into your project


```js
import { WaibocReactWidget }      from 'waiboc-widget-react' ;

```

2- Put yours credentials as props

```js
<WaibocReactWidget
                    idAgent="IdChatbotWaiboc"
                    options={{
                        fontSize:'22px',
                        color: 'black'
                    }}
                    secret="SecretSupliedByWaiboc"
            />
```