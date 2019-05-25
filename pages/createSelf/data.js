/**
 * @module 女生用户回答问题后，答案和衣服的映射关系 
 * @ques1 性格描述 A内向型 B外倾型 C完美型 D和平型
 * @ques2 发型特征描述 A长发 B短发 C双马尾 D丸子头
 * @ques3 日常穿衣风格 A日常风 B学院风 C运动风
 * 
 * @answer 第一个数字表示头发 第二个数字表示衣服 
 */

const femaleAnswerMap = new Map([
  ['AAA', 14],
  ['AAB', 11],
  ['AAC', 12],
  ['ABA', 44],
  ['ABB', 41],
  ['ABC', 42],
  ['ACA', 24],
  ['ACB', 21],
  ['ACC', 22],
  ['ADA', 44],
  ['ADB', 41],
  ['ADC', 42],

  ['BAA', 15],
  ['BAB', 11],
  ['BAC', 12],
  ['BBA', 55],
  ['BBB', 51],
  ['BBC', 52],
  ['BCA', 25],
  ['BCB', 21],
  ['BCC', 22],
  ['BDA', 45],
  ['BDB', 41],
  ['BDC', 42],

  ['CAA', 14],
  ['CAB', 11],
  ['CAC', 12],
  ['CBA', 44],
  ['CBB', 41],
  ['CBC', 42],
  ['CCA', 24],
  ['CCB', 21],
  ['CCC', 22],
  ['CDA', 44],
  ['CDB', 41],
  ['CDC', 42],

  ['DAA', 15],
  ['DAB', 11],
  ['DAC', 12],
  ['DBA', 55],
  ['DBB', 51],
  ['DBC', 52],
  ['DCA', 25],
  ['DCB', 21],
  ['DCC', 22],
  ['DDA', 45],
  ['DDB', 41],
  ['DDC', 42],
])

/**
 * @module 男生用户回答问题后，答案和衣服的映射关系 
 * @ques1 性格描述 A内向型 B外倾型 C完美型 D和平型
 * @ques2 发型特征描述 A寸头 B短发 C中短发 
 * @ques3 日常穿衣风格 A日常风 B学院风 C运动风
 * 
 * @answer 第一个数字表示头发 第二个数字表示衣服 
 */

const maleAnswerMap = new Map([
  ['AAA', 52],
  ['AAB', 54],
  ['AAC', 55],
  ['ABA', 12],
  ['ABB', 14],
  ['ABC', 15],
  ['ACA', 32],
  ['ACB', 34],
  ['ACC', 35],

  ['BAA', 51],
  ['BAB', 54],
  ['BAC', 55],
  ['BBA', 21],
  ['BBB', 24],
  ['BBC', 25],
  ['BCA', 31],
  ['BCB', 34],
  ['BCC', 35],

  ['CAA', 52],
  ['CAB', 54],
  ['CAC', 55],
  ['CBA', 12],
  ['CBB', 14],
  ['CBC', 15],
  ['CCA', 32],
  ['CCB', 34],
  ['CCC', 35],

  ['DAA', 51],
  ['DAB', 54],
  ['DAC', 55],
  ['DBA', 41],
  ['DBB', 44],
  ['DBC', 45],
  ['DCA', 31],
  ['DCB', 34],
  ['DCC', 35],
])

const femaleQues = [
  {
    ques: '/images/question1.png',
    answerList: [
      {
        name: `内向型`,
        value: 'A',
      },
      {
        name: `外倾型`,
        value: 'B',
      },
      {
        name: `完美型`,
        value: 'C',
      },
      {
        name: `和平型`,
        value: 'D',
      }
    ]
  },
  {
    ques: `/images/question2.png`,
    answerList: [
      {
        name: `长 发`,
        value: 'A',
      },
      {
        name: `短 发`,
        value: 'B',
      },
      {
        name: `双马尾`,
        value: 'C',
      },
      {
        name: `丸子头`,
        value: 'D',
      }
    ]
  },
  {
    ques: `/images/question3.png`,
    answerList: [
      {
        name: `日常风`,
        value: 'A',
      },
      {
        name: `学院风`,
        value: 'B',
      },
      {
        name: `运动风`,
        value: 'C',
      }
    ]
  }
];

const maleQues = [
  {
    ques: '/images/question1.png',
    answerList: [
      {
        name: `内向型`,
        value: 'A',
      },
      {
        name: `外倾型`,
        value: 'B',
      },
      {
        name: `完美型`,
        value: 'C',
      },
      {
        name: `和平型`,
        value: 'D',
      }
    ]
  },
  {
    ques: `/images/question2.png`,
    answerList: [
      {
        name: `寸 发`,
        value: 'A',
      },
      {
        name: `短 发`,
        value: 'B',
      },
      {
        name: `中短发`,
        value: 'C',
      },
    ]
  },
  {
    ques: `/images/question3.png`,
    answerList: [
      {
        name: `日常风`,
        value: 'A',
      },
      {
        name: `学院风`,
        value: 'B',
      },
      {
        name: `运动风`,
        value: 'C',
      }
    ]
  }
]



export {
  femaleAnswerMap,
  maleAnswerMap,
  femaleQues,
  maleQues,
}