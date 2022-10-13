class resultObj {
  constructor(){
    this.data=null,
    this.message='',
    this.resultCode=0
  }
}
export class FailRes extends resultObj{
  constructor(params){
    if(params){
      const {data,message} = params
      this.data=data || null
      this.message=message || 'fail'
      this.resultCode=1
    }
  }
}
export class SuccessRes extends resultObj{
  constructor(params){
    if(params){
      const {data,message} = params
      this.data=data || null
      this.message=message || 'success'
      this.resultCode=0
    }
  }
}