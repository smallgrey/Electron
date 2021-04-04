const MajorService = require('../service/majorService');
const ClassService = require('../service/classService');
const StuService = require('../service/stuService');
const CourseService = require('../service/courseService');
const { ExcelMsg } = require('../msgCode/excelMsg');
const fs = require('fs');
const formidable = require("formidable");
const path = require("path");
const xlsx = require("node-xlsx");

class ExcelControler {
	static async uploadExcel(ctx){
		switch (ctx.query.uploadType) {
			case 'major':
				break;
			case 'class':
				if(!ctx.query.majorId){
					return ExcelMsg(3004)
				}
				break;
			case 'stu':
				if(!ctx.query.classId){
					return ExcelMsg(3004)
				}
				break;
			case 'course':
				if(!ctx.query.yearId || !ctx.query.majorId){
					return ExcelMsg(3004)
				}
				break;				
			default:
				return ExcelMsg(3004)
				break;
		}
		
		let response ={}
		var form = new formidable.IncomingForm();  //既处理表单，又处理文件上传
		//设置文件上传文件夹/路径，__dirname是一个常量，为当前路径
		let uploadDir = path.join(__dirname, "../public/upload/"+ ctx.query.uploadType + "/");
		form.uploadDir = uploadDir; //本地文件夹目录路径
		
		await new Promise((resolve, reject) => {
		   form.parse(ctx, (err, fields, files) => {
		   	if(err){
		   		reject(3003)
		   	} else{
		   		let oldPath = files.cover.path;//这里的路径是图片的本地路径
		   		let fileName = new Date().getTime()+ "." + files.cover.name.split(".")[files.cover.name.split(".").length-1]
		   		let newPath = path.join(path.dirname(oldPath), fileName);
		   		fs.rename(oldPath, newPath, () => { //fs.rename重命名图片名称
		   		   let ret = this.readData(newPath, ctx.query)
		   		   if(ret){
		   				resolve(200)
		   		   }else {
		   				reject(3001)
		   		   }
		   		})
		   	}
		    })
		}).then((res)=> {
			response = ExcelMsg(res)
		}, (error) => {
			 response = ExcelMsg(error)
		})
		return response
	}
	
	static async readData(filePath, param) {
		let data = xlsx.parse(filePath)[0].data
		data.splice(0, 1)
		let result = ""
		let temp = []
		for(let i =0;i<data.length;i++){
			temp = temp.concat(data[i])
		}
		switch (param.uploadType) {
			case 'major':
				result = await MajorService.addMajor(JSON.stringify(temp));
				break;
			case 'class':
			    let classInfo = {
					classInfo: JSON.stringify(temp),
					majorId: param.majorId
				} 
				result = await ClassService.addClass(classInfo);
			case 'stu':
			    let stuInfo = {
					stuInfo: JSON.stringify(data),
					classId: param.classId
				} 
				result = await StuService.addStu(stuInfo);
				break;
			case 'course':
			    let courseInfo = {
					courseInfo: JSON.stringify(temp),
					yearId: param.yearId,
					majorId: param.majorId
				} 
				result = await CourseService.addCourse(courseInfo);	
		}
		return result
	}
	
	static async writeData(ctx) {
		let response = {}
		var datas=[];
		var data=["学号","姓名","联系方式"];
		var data1=["2013005479","王荣辉","15234109892"];
		datas.push(data);    //一行一行添加的 不是一列一列
		datas.push(data1);    
		let ret = await this.writeXls(datas);
		if(ret){
			response = Object.assign( ExcelMsg(200),{
				msg: "保存到excel成功"
			})
		}else {
			response = ExcelMsg(3002)
		}
		return response
	}
	
	static async writeXls(datas) {
	    var buffer = xlsx.build([
	        {
	            name:'sheet1',
	            data:datas   
	        }
	    ]);
	    await fs.writeFileSync('./static/excel/download/download.xlsx',buffer,{'flag':'w'});   //生成excel
		return 1;
	}
}

module.exports = ExcelControler;