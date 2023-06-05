const input_image=document.querySelector("#input_image");
const img=document.querySelector("#photo");
const imgdev=document.querySelector("#imgdev");
const input_label=document.querySelector("#input_label");

img.addEventListener("mouseenter",function()
{
	input_label.style.display="block";
})
img.addEventListener("mouseleave",function()
{
	input_label.style.display="none";
})

input_image.addEventListener("change",function()
{
	const ChoosedFile=this.files[0];
	if(ChoosedFile)
	{
		const reader=new FileReader();
		reader.addEventListener("load",function()
		{
			img.setAttribute("src",reader.result);
		});

		reader.readAsDataURL(ChoosedFile); 
	}
	 
})